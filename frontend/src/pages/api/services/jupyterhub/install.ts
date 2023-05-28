// Path: src/pages/api/services/jupyterhub/install.ts
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { setSSEHeaders, initInterval, sendSSEPercentage, sendSSEEnd, sendSSEError } from '@/lib/sse';
import { verify } from '@/utils/auth';
import { installJupyterHub } from '@/utils/executor';
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

const NumberOfTasks = 44;

// GET install jupyterhub
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/services/jupyterhub/install');

    const jupyterHubService = await prisma.jupyterHubService.findFirst();

    if (!jupyterHubService) {
        return res.status(500).json({ error: 'JupyterHub not found' });
    }

    if (jupyterHubService.installed) {
        return res.status(400).json({ error: 'JupyterHub already installed' });
    }

    setSSEHeaders(res);
    let count = 0;

    try {
        // Avoid timeout
        const intervalID = initInterval(res, () => {
            sendSSEPercentage(res, count, NumberOfTasks);
        });

        const token = await installJupyterHub((data: string) => {
            if (data.includes('TASK')) {
                count++;
                sendSSEPercentage(res, count, NumberOfTasks);
            }
        });

        await prisma.jupyterHubService.update({
            where: {
                id: jupyterHubService.id
            },
            data: {
                installed: true,
                token: token
            }
        });
        sendSSEEnd(res, 'JupyterHub installed', intervalID);
    } catch (error: any) {
        logger.error(error.message);
        sendSSEError(res, error.message);
    }
}
