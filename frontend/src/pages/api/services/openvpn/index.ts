// Path: src/app/pages/services/openvpn/index.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getOpenVPNStatus, restartOpenVPN } from '@/utils/executor';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res);
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    switch (req.method) {
        case 'GET':
            return GET(req, res);
        case 'POST':
            return POST(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

// GET openvpn status
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/openvpn');
    try {
        const message = await getOpenVPNStatus();
        return res.json({ message });
    } catch (error: any) {
        return res.status(500).json({ error: error.message, status: 'down' });
    }
}

// POST restart openvpn service
async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/openvpn');
    try {
        await verify(req, res, 'ADMIN');
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        await restartOpenVPN();
        return res.json({ message: 'OpenVPN restarted' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
