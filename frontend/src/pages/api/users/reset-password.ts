import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashPassword, omit } from '@/utils/utils';
import { z } from 'zod';
import { zxcvbnPasswordStrength } from '@/lib/zxcvbn';
import { randomUUID } from 'crypto';
import { logger } from '@/lib/logger';
import { sendResetPasswordEmail } from '@/lib/nodemailer';

const passwordSchema = z.object({
    password: z.string()
});

const emailSchema = z.object({
    email: z.string().email()
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            return POST(req, res);
        case 'PATCH':
            return PATCH(req, res);
        default:
            res.setHeader('Allow', ['PATCH']);
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

// POST /api/users/reset-password - Send password reset email
async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/users/reset-password');
    const result = emailSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(422).json({ error: result.error });
    }

    const email = result.data.email;

    const user = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            role: true
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'Not found' });
    }

    if (user.role === 'INACTIVE') {
        return res.status(400).json({ error: 'User is inactive' });
    }

    const passwordResetToken = await prisma.passwordResetToken.findFirst({
        where: {
            user: {
                id: user.id
            }
        },
        select: {
            userId: true
        }
    });

    if (passwordResetToken) {
        await prisma.passwordResetToken.delete({
            where: {
                userId: passwordResetToken.userId
            }
        });
    }

    const { token } = await prisma.passwordResetToken.create({
        data: {
            user: {
                connect: {
                    id: user.id
                }
            },
            token: randomUUID(),
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        },
        select: {
            token: true
        }
    });

    sendResetPasswordEmail(email, token);

    return res.status(200).json({ success: true });
}

// PATCH /api/users/reset-password
async function PATCH(req: NextApiRequest, res: NextApiResponse) {
    logger.info('PATCH /api/users/reset-password');
    const token = req.query.token as string;

    const passwordResetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        select: {
            user: {
                select: {
                    id: true
                }
            },
            token: true,
            expires: true
        }
    });

    if (!passwordResetToken) {
        return res.status(404).json({ error: 'Not found' });
    }

    if (passwordResetToken.expires < new Date()) {
        return res.status(400).json({ error: 'Token expired' });
    }

    if (token !== passwordResetToken.token) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    const result = passwordSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(422).json({ error: 'Invalid password' });
    }

    // Verify strength of password
    if (zxcvbnPasswordStrength(result.data.password).score < 4) {
        return res.status(422).json({ error: 'Password is too weak' });
    }

    const user = await prisma.user.update({
        where: { id: passwordResetToken.user.id },
        data: {
            password: hashPassword(result.data.password),
            passwordResetToken: {
                delete: true
            }
        }
    });

    return res.status(200).json(omit(user, 'password'));
}
