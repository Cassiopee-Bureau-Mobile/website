// Path: src/pages/api/services/jupyterhub/hosts.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getJupyterHubHosts, setJupyterHubHosts } from '@/utils/executor';
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

// POST write jupyterhub host file
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/jupyterhub/hosts');

    try {
        const result = hostVarsSchema.safeParse(JSON.parse(req.body));

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        await setJupyterHubHosts(result.data);

        return res.json({ message: 'JupyterHub hosts file written' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// GET infos of the jupyterhub host file
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/jupyterhub/hosts');

    try {
        const host = await getJupyterHubHosts();
        return res.json(host);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
