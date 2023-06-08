//Path src/pages/api/users/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, omit } from '@/utils/utils';
import { logger } from '@/lib/logger';
import { zxcvbnPasswordStrength } from '@/lib/zxcvbn';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/lib/nodemailer';

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

// GET /api/users
async function GET(req: NextApiRequest, res: NextApiResponse) {
    logger.info('GET /api/users');

    const users = await prisma.user.findMany();

    if (!users) {
        return res.status(500).json({ error: 'Could not retrieve users' });
    }

    return res.json(users.map((user) => omit(user, 'password')));
}

// POST new user
async function POST(req: NextApiRequest, res: NextApiResponse) {
    logger.info('POST /api/users');
    //Validate request body
    const result = userSchema.safeParse(req.body);

    //If validation fails, return error
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }

    // Verify strength of password
    if (zxcvbnPasswordStrength(result.data.password).score < 4) {
        return res.status(409).json({ error: 'Password is too weak' });
    }

    // Check if username or email already exists
    const userExists = await prisma.user.findFirst({
        where: {
            OR: [{ username: result.data.username }, { email: result.data.email }]
        }
    });

    if (userExists) {
        return res.status(422).json({ error: 'Username or email already exists' });
    }

    const user = await prisma.user.create({
        data: {
            username: result.data.username,
            password: hashPassword(result.data.password),
            email: result.data.email,
            profile: {
                create: {
                    firstName: result.data.firstName,
                    lastName: result.data.lastName
                }
            },
            emailVerificationRequest: {
                create: {
                    token: randomUUID()
                }
            }
        },
        select: {
            username: true,
            email: true,
            emailVerificationRequest: {
                select: {
                    token: true
                }
            }
        }
    });

    if (!user || !user.emailVerificationRequest) {
        return res.status(500).json({ error: 'User could not be created' });
    }

    sendVerificationEmail(user.email, user.emailVerificationRequest.token);

    return res.json({ message: `User ${user.username} created` });
}
