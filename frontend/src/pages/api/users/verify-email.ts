import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'PATCH':
            return PATCH(req, res);
        default:
            res.setHeader('Allow', ['PATCH']);
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

// PATCH /api/users/:user - This function will be in charge of verify the email of the user
async function PATCH(req: NextApiRequest, res: NextApiResponse) {
    logger.info('PATCH /api/users/verify-email');
    const token = req.query.token as string;

    const emailVerificationRequest = await prisma.emailVerificationRequest.findUnique({
        where: { token },
        select: {
            user: {
                select: {
                    emailVerified: true,
                    id: true
                }
            },
            token: true
        }
    });

    if (!emailVerificationRequest) {
        return res.status(404).json({ error: 'Not found' });
    }

    if (token !== emailVerificationRequest.token) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    await prisma.user.update({
        where: { id: emailVerificationRequest.user.id },
        data: {
            emailVerified: new Date(),
            emailVerificationRequest: {
                delete: true
            }
        }
    });

    return res.status(200).json({ message: 'Email verified' });
}
