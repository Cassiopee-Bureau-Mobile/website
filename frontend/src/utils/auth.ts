import { options } from '@/pages/api/auth/[...nextauth]';
import { Role } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

/**
 * This function verifies that the user is logged in and active.
 * @param req
 * @param res
 * @param scope
 *
 * @throws Error if the user is not logged in or is inactive.
 */
export async function verify(req: NextApiRequest, res: NextApiResponse, scope: Role = 'USER') {
    const session = await getServerSession(req, res, options);
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }
    if (session.user.role === 'INACTIVE') {
        throw new Error('Unauthorized');
    }

    if (scope === 'ADMIN' && session.user.role !== 'ADMIN') {
        throw new Error('Forbidden');
    }
}
