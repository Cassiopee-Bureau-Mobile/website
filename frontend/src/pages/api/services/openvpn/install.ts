// Path: src/pages/api/services/openvpn/install.ts
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { initInterval, sendSSEEnd, sendSSEError, sendSSEPercentage, setSSEHeaders } from '@/lib/sse';
import { verify } from '@/utils/auth';
import { installOpenVPN } from '@/utils/executor';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res, 'ADMIN');
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    switch (req.method) {
        case 'GET':
            return GET(req, res);
        default:
            res.setHeader('Allow', ['GET']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

const NumberOfTasks = 38;

// GET install openvpn
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/openvpn/install');

    const openVPNService = await prisma.openVPNService.findFirst();

    if (!openVPNService) {
        return res.status(500).json({ error: 'OpenVPN not found' });
    }

    if (openVPNService.installed) {
        return res.status(400).json({ error: 'OpenVPN already installed' });
    }

    setSSEHeaders(res);
    let count = 0;

    try {
        // Avoid timeout
        const intervalID = initInterval(res, () => {
            sendSSEPercentage(res, count, NumberOfTasks);
        });

        await installOpenVPN((data: string) => {
            if (data.includes('TASK')) {
                count++;
                sendSSEPercentage(res, count, NumberOfTasks);
            }
        });

        await prisma.openVPNService.update({
            where: {
                id: openVPNService.id
            },
            data: {
                installed: true
            }
        });
        sendSSEEnd(res, 'OpenVPN installed', intervalID);
    } catch (error: any) {
        logger.error(error.message);
        sendSSEError(res, error.message);
    }
}
