// Path: src/pages/api/services/jupyterhub/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { zxcvbnPasswordStrength } from '@/lib/zxcvbn';
import { addJupyterHubUser } from '@/utils/executor';
import { verify } from '@/utils/auth';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceType } from '@prisma/client';
import { initInterval, sendSSEEnd, sendSSEError, sendSSEPercentage, setSSEHeaders } from '@/lib/sse';
import { fetchData } from '@/utils/fetchClient';
import { getJupyterHubToken, getJupyterHubUrl } from '@/utils/queries';

const userSchema = z.object({
    user: z.string(),
    password: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res);
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    switch (req.method) {
        case 'POST':
            return POST(req, res);
        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

const NumberOfTasks = 8;

// POST new user
async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/jupyterhub/users');
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: 'Missing password' });
    }

    const { user, password } = result.data;

    // Verify that the password is strong enough
    const passwordCheck = zxcvbnPasswordStrength(password);
    if (passwordCheck.score < 4) {
        return res.status(400).json({ error: 'Password is too weak' });
    }

    const service = await prisma.user.findFirst({
        where: {
            username: user
        },
        select: {
            profile: { select: { serviceRegistration: { select: { name: true } } } }
        }
    });

    if (service?.profile?.serviceRegistration.map((data) => data.name).includes(ServiceType.JUPYTERHUB)) {
        return res.status(400).json({ error: 'User already added to JupyterHub' });
    }

    setSSEHeaders(res);
    let count = 0;

    try {
        const token = await getJupyterHubToken();
        const jupyterHubUrl = await getJupyterHubUrl();

        const interval = initInterval(res, () => {
            sendSSEPercentage(res, count, NumberOfTasks);
        });

        await addJupyterHubUser(user, password, (data: string) => {
            if (data.includes('TASK')) {
                count++;
                sendSSEPercentage(res, count, NumberOfTasks);
            }
        });

        await fetchData(
            `/jupyter/hub/api/users/${user}`,
            {
                headers: {
                    Authorization: `token ${token}`
                },
                method: 'POST'
            },
            jupyterHubUrl
        );

        await prisma.serviceRegistration.create({
            data: {
                name: ServiceType.JUPYTERHUB,
                profileUserId: await prisma.user.findFirstOrThrow({ where: { username: user } }).then((user) => user.id),
                jupyterHubServiceId: await prisma.jupyterHubService.findFirstOrThrow().then((service) => service.id)
            }
        });

        sendSSEEnd(res, `User ${user} added to JupyterHub`, interval);
    } catch (error: any) {
        sendSSEError(res, error.message);
        logger.error(error);
    }
}
