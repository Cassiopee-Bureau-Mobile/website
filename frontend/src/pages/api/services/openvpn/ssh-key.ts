// Path: src/pages/api/services/openvpn/ssh-key.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getOpenVPNSSHKey, setOpenVPNSSHKey } from '@/utils/executor';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const keySchema = z.object({
    ssh_key: z.string()
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

// POST write OpenVPN ssh key
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/openvpn/ssh-key');

    try {
        const result = keySchema.parse(JSON.parse(req.body));

        await setOpenVPNSSHKey(result);

        return res.json({ message: 'OpenVPN ssh key file written' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// GET get openvpn ssh key
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/openvpn/ssh-key');

    try {
        const ssh_key = await getOpenVPNSSHKey();
        return res.json(ssh_key);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
