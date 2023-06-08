// Path: src/pages/api/services/ip-status.ts
import { logger } from '@/lib/logger';
import { verify } from '@/utils/auth';
import { getIpStatus } from '@/utils/executor';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const ipSchema = z.object({
    ip: z.string().ip()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res);
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

// POST verify ip status
async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/services/ip-status');
    const result = ipSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(422).json({ error: result.error });
    }
    const ip = result.data.ip;

    try {
        const message = await getIpStatus(ip);
        return res.status(200).json({ message });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
