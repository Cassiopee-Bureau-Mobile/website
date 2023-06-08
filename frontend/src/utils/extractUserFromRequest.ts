import prisma from '@/lib/prisma';
import { options } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

const userSchema = z.object({
    user: z.string()
});

export async function extractUserFromRequest(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
    const params = req.query;
    const result = userSchema.safeParse(params);
    if (!result.success) {
        return null;
    }
    const { user } = result.data;

    const session = await getServerSession(req, res, options);
    if (!session || !session.user) {
        return null;
    }

    if (session.user.role === 'INACTIVE') {
        return null;
    }

    if (session.user.role === 'USER') {
        if (session.user.username !== user) {
            return null;
        }
    }

    const findUser = await prisma.user.findUnique({
        where: {
            username: user
        },
        select: {
            username: true
        }
    });

    if (!findUser) {
        return null;
    }

    return findUser.username;
}
