// Path: src/pages/api/services/jupyterhub/index.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getIpStatus, restartJupyterHub } from '@/utils/executor';
import { fetchData } from '@/utils/fetchClient';
import { getJupyterHubIP, getJupyterHubToken, getJupyterHubUrl } from '@/utils/queries';
import { NotFoundError } from '@/utils/utils';
import { HTTPError } from 'ky';
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
            res.setHeader('Allow', ['POST', 'GET']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

// POST restart jupyterhub service
async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/jupyterhub');
    try {
        await verify(req, res, 'ADMIN');
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await restartJupyterHub();
        return res.json({ message: 'JupyterHub restarted' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

// GET jupyterhub status
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/jupyterhub');
    try {
        const url = await getJupyterHubUrl();
        const ip = await getJupyterHubIP();

        const host = await getIpStatus(ip);
        if (host === 'down') {
            return res.json({ message: 'down' });
        }

        const fetchJupyterHubVersion = () => fetchData<{ version: string }>(`/jupyter/hub/api/`, {}, url);

        await fetchJupyterHubVersion();
        return res.json({ message: 'up' });
    } catch (error: any) {
        if (error instanceof HTTPError || error instanceof NotFoundError || error instanceof TypeError) {
            return res.json({ message: 'down' });
        }
        logger.error(error);
        return res.status(500).json({ error: error.message, status: 'down' });
    }
}
