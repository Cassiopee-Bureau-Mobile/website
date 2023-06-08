// Path: src/pages/api/services/openvpn/users/[user]/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractUserFromRequest } from '@/utils/extractUserFromRequest';
import { getOpenVPNClientConfig } from '@/utils/executor';
import { NotFoundError } from '@/utils/utils';
import { verify } from '@/utils/auth';
import { logger } from '@/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res);
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

// GET user openvpn config
async function GET(req: NextApiRequest, res: NextApiResponse) {
    const user = await extractUserFromRequest(req, res);
    logger.info(`GET /api/services/openvpn/users/${req.query.user}`);

    if (!user) {
        return res.status(400).json({ error: 'Invalid user' });
    }

    try {
        const file = await getOpenVPNClientConfig(user);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${user}.ovpn`);
        return res.status(200).send(file);
    } catch (error: any) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}
