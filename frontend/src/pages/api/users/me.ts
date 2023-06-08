import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { options } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { Session } from 'next-auth';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const userDataSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, options);

    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    switch (req.method) {
        case 'GET':
            return GET(req, res, session);
        case 'PATCH':
            return PATCH(req, res, session);
        default:
            res.setHeader('Allow', ['GET', 'PATCH']);
            return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse, session: Session) {
    logger.info('GET /api/users/me');
    const user = await prisma.user.findUnique({
        where: {
            username: session.user.username
        },
        select: {
            profile: true
        }
    });

    if (!user || !user.profile) {
        return res.status(404).json({ message: 'User Not Found' });
    }

    const response: UserData = {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName
    };
    res.status(200).json(response);
}

async function PATCH(req: NextApiRequest, res: NextApiResponse, session: Session) {
    logger.info('PATCH /api/users/me');

    const user = await prisma.user.findUnique({
        where: {
            username: session.user.username
        },
        select: {
            profile: true
        }
    });

    if (!user || !user.profile) {
        return res.status(404).json({ message: 'User Not Found' });
    }

    const result = userDataSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const { firstName, lastName } = result.data;

    const updatedUser = await prisma.user.update({
        where: {
            username: session.user.username
        },
        data: {
            profile: {
                update: {
                    firstName, // If firstName is undefined, it will not be updated
                    lastName // If lastName is undefined, it will not be updated
                }
            }
        },
        select: {
            profile: true
        }
    });

    const response: UserData = {
        firstName: updatedUser.profile!.firstName,
        lastName: updatedUser.profile!.lastName
    };
    res.status(200).json(response);
}
