// Path: src/pages/api/services/jupyterhub/users/[user]/index.ts
import { fetchData } from '@/utils/fetchClient';
import { HTTPError } from 'ky';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { extractUserFromRequest } from '@/utils/extractUserFromRequest';
import { changeJupyterHubUserPassword, deleteJupyterHubUser, getIpStatus } from '@/utils/executor';
import { verify } from '@/utils/auth';
import { logger } from '@/lib/logger';
import { getJupyterHubIP, getJupyterHubToken, getJupyterHubUrl } from '@/utils/queries';
import { zxcvbnPasswordStrength } from '@/lib/zxcvbn';
import { setSSEHeaders, initInterval, sendSSEPercentage, sendSSEEnd, sendSSEError } from '@/lib/sse';
import prisma from '@/lib/prisma';
import { ServiceType } from '@prisma/client';
import { NotFoundError } from '@/utils/utils';

const changePasswordSchema = z.object({
    password: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res);
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    switch (req.method) {
        case 'GET':
            return GET(req, res);
        case 'PUT':
            return PUT(req, res);
        case 'DELETE':
            return DELETE(req, res);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

// GET user data from JupyterHub
async function GET(req: NextApiRequest, res: NextApiResponse<JupyterUserCard | ApiError>) {
    logger.info(`GET /api/services/jupyterhub/users/${req.query.user}`);
    const user = await extractUserFromRequest(req, res);

    if (!user) {
        return res.status(400).json({ error: 'Invalid user' });
    }

    const service = await prisma.user.findFirst({
        where: {
            username: user
        },
        select: {
            profile: { select: { serviceRegistration: { select: { name: true } } } }
        }
    });

    try {
        const jupyterHubUrl = await getJupyterHubUrl();
        const token = await getJupyterHubToken();

        if ((await getIpStatus(await getJupyterHubIP())) === 'down') {
            return res.json({ status: 'host-down', data: null });
        }

        if (!service?.profile?.serviceRegistration.map((data) => data.name).includes(ServiceType.JUPYTERHUB)) {
            return res.json({ status: 'unregistred', data: null });
        }

        const fetchUserData = () =>
            fetchData<JupyterUser>(
                `/jupyter/hub/api/users/${user}`,
                {
                    headers: {
                        Authorization: `token ${token}`
                    }
                },
                jupyterHubUrl
            );

        const data = await fetchUserData();
        return res.json({ status: 'registred', data });
    } catch (error: any) {
        if (error instanceof HTTPError || error instanceof NotFoundError) {
            if (error instanceof HTTPError && error.response.status === 404) {
                return res.json({ status: 'unregistred', data: null });
            }
            return res.json({ status: 'host-down', data: null });
        } else {
            logger.error('Final catch', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

const NumberOfTasks = 4;
// PUT change user password
async function PUT(req: NextApiRequest, res: NextApiResponse) {
    logger.info(`PUT /api/services/jupyterhub/users/${req.query.user}`);
    const user = await extractUserFromRequest(req, res);

    if (!user) {
        return res.status(400).json({ error: 'Invalid user' });
    }

    //Get password from request body
    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: 'Missing password' });
    }

    const { password } = result.data;

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

    if (!service?.profile?.serviceRegistration.map((data) => data.name).includes(ServiceType.JUPYTERHUB)) {
        return res.status(400).json({ error: 'User not registred to JupyterHub' });
    }

    setSSEHeaders(res);
    let count = 0;

    try {
        const interval = initInterval(res, () => {
            sendSSEPercentage(res, count, NumberOfTasks);
        });

        await changeJupyterHubUserPassword(user, password, (data: string) => {
            if (data.includes('TASK')) {
                count++;
                sendSSEPercentage(res, count, NumberOfTasks);
            }
        });

        sendSSEEnd(res, `User ${user} modified to JupyterHub`, interval);
    } catch (error: any) {
        sendSSEError(res, error.message);
    }
}

// DELETE delete user
async function DELETE(req: NextApiRequest, res: NextApiResponse) {
    logger.info(`DELETE /api/services/jupyterhub/users/${req.query.user}`);
    const user = await extractUserFromRequest(req, res);

    if (!user) {
        return res.status(400).json({ error: 'Invalid user' });
    }

    const service = await prisma.user.findFirst({
        where: {
            username: user
        },
        select: {
            profile: { select: { serviceRegistration: { select: { name: true } } } },
            id: true
        }
    });

    if (!service?.profile?.serviceRegistration.map((data) => data.name).includes(ServiceType.JUPYTERHUB)) {
        return res.status(400).json({ error: 'User not registred to JupyterHub' });
    }

    try {
        await deleteJupyterHubUser(user);

        await prisma.serviceRegistration.deleteMany({
            where: {
                profileUserId: service.id,
                name: ServiceType.JUPYTERHUB
            }
        });
        return res.json({ message: `User ${user} deleted` });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
