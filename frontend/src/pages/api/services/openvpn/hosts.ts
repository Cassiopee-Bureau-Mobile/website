// Path: src/pages/api/services/openvpn/hosts.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getOpenVPNHosts, setOpenVPNHosts } from '@/utils/executor';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const hostVarsSchema = z.object({
    ansible_host: z.string().ip(),
    ansible_user: z.string(),
    ansible_sudo_pass: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res, 'ADMIN');
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    switch (req.method) {
        case 'GET':
            return GET(req, res);
        case 'POST':
            return POST(req, res);
        default:
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

// POST write OpenVPN host file
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/openvpn/hosts');

    try {
        const result = hostVarsSchema.parse(JSON.parse(req.body));

        await setOpenVPNHosts(result);

        return res.json({ message: 'OpenVPN hosts file written' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// GET infos of the OpenVPN host file
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/openvpn/hosts');

    try {
        const host = await getOpenVPNHosts();
        return res.json(host);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
