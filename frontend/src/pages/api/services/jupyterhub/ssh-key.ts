// Path: src/pages/api/services/jupyterhub/ssh-key.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getJupyterHubSSHKey, setJupyterHubSSHKey } from '@/utils/executor';
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
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

// POST write jupyterhub ssh key
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/jupyterhub/ssh-key');

    try {
        const result = keySchema.safeParse(JSON.parse(req.body));

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        await setJupyterHubSSHKey(result.data);

        return res.json({ message: 'JupyterHub ssh key file written' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// GET get juptyerhub ssh key
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/jupyterhub/ssh-key');

    try {
        const ssh_key = await getJupyterHubSSHKey();
        return res.json(ssh_key);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
