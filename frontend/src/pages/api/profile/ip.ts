import { logger } from '@/lib/logger';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse<ClientIp>) {
    logger.info('GET /api/profile/ip');
    const clientIP = req.headers['x-forwarded-for'];

    if (clientIP) {
        res.status(200).json({ ip: clientIP.toString() });
    } else {
        res.status(500).json({ ip: 'XXX.XXX.XXX.XXX' });
    }
}
