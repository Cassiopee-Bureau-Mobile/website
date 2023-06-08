//Path src/pages/api/services/openvpn/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { addOpenVPNClient } from '@/utils/executor';
import { verify } from '@/utils/auth';
import { initInterval, sendSSEEnd, sendSSEError, sendSSEPercentage, setSSEHeaders } from '@/lib/sse';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { ServiceType } from '@prisma/client';

const userSchema = z.object({
    user: z.string()
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

const NumberOfTasks = 36;

// POST new user openvpn config
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/openvpn/users');
    //Get user from request body
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: 'Missing user' });
    }

    const { user } = result.data;

    const service = await prisma.user.findFirst({
        where: {
            username: user
        },
        select: {
            profile: { select: { serviceRegistration: { select: { name: true } } } }
        }
    });

    if (service?.profile?.serviceRegistration.map((data) => data.name).includes(ServiceType.OPENVPN)) {
        return res.status(400).json({ error: 'User already added to OpenVPN' });
    }

    setSSEHeaders(res);
    let count = 0;

    try {
        const interval = initInterval(res, () => {
            sendSSEPercentage(res, count, NumberOfTasks);
        });

        await addOpenVPNClient(user, (data: string) => {
            if (data.includes('TASK')) {
                count++;
                sendSSEPercentage(res, count, NumberOfTasks);
            }
        });

        await prisma.serviceRegistration.create({
            data: {
                name: ServiceType.OPENVPN,
                profileUserId: await prisma.user.findFirstOrThrow({ where: { username: user } }).then((user) => user.id),
                openVPNServiceId: await prisma.openVPNService.findFirstOrThrow().then((service) => service.id)
            }
        });

        sendSSEEnd(res, `User ${user} added`, interval);
    } catch (error: any) {
        sendSSEError(res, error.message);
    }
}
