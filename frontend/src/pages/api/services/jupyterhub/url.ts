// Path: src/pages/api/services/jupyterhub/url.ts
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { verify } from '@/utils/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const urlSchema = z.object({
    url: z.string().url()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res, 'ADMIN');
    } catch (error: any) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    switch (req.method) {
        case 'POST':
            return POST(req, res);
        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

// POST write jupyterhub url
export async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/jupyterhub/url');

    try {
        const result = urlSchema.safeParse(JSON.parse(req.body));

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        await prisma.jupyterHubService.findFirstOrThrow().then((service) =>
            prisma.jupyterHubService.update({
                where: { id: service.id },
                data: { url: result.data.url }
            })
        );

        return res.json({ message: 'JupyterHub url written' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
