import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from '@/utils/auth';
import { extractUserFromRequest } from '@/utils/extractUserFromRequest';
import { omit } from '@/utils/utils';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { deleteJupyterHubUser, revokeOpenVPNClient } from '@/utils/executor';

const userSchema = z.object({
    role: z.enum(['USER', 'ADMIN', 'INACTIVE'])
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        await verify(req, res);
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const username = await extractUserFromRequest(req, res);

    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
        case 'GET':
            return GET(req, res, username);
        case 'PUT':
            return PUT(req, res, username);
        case 'DELETE':
            return DELETE(req, res, username);
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

// GET /api/users/:user
async function GET(req: NextApiRequest, res: NextApiResponse, username: string) {
    logger.info(`GET /api/users/${username}`);

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            profile: {
                select: {
                    serviceRegistration: {
                        select: {
                            name: true
                        }
                    },
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'Not found' });
    }

    return res.json(omit(user, 'password'));
}

// PUT /api/users/:user
async function PUT(req: NextApiRequest, res: NextApiResponse, username: string) {
    logger.info(`PUT /api/users/${username}`);
    try {
        await verify(req, res, 'ADMIN');
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }

    const user = await prisma.user.update({
        where: { username: username },
        data: {
            role: result.data.role
        },
        include: {
            profile: true
        }
    });

    return res.json(omit(user, 'password'));
}

// DELETE /api/users/:user
async function DELETE(req: NextApiRequest, res: NextApiResponse, username: string) {
    logger.info(`DELETE /api/users/${username}`);
    try {
        await verify(req, res, 'ADMIN');
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    let user = await prisma.user.findFirst({
        where: { username }
    });

    if (!user) {
        return res.status(404).json({ error: 'Not found' });
    }

    try {
        const openvpnClient = await prisma.serviceRegistration.findFirst({
            where: {
                profileUserId: user.id,
                name: 'OPENVPN'
            }
        });

        if (openvpnClient) {
            await revokeOpenVPNClient(user.username);
            await prisma.serviceRegistration.deleteMany({
                where: {
                    profileUserId: user.id,
                    name: 'OPENVPN'
                }
            });
        }

        const jupyterhubUser = await prisma.serviceRegistration.findFirst({
            where: {
                profileUserId: user.id,
                name: 'JUPYTERHUB'
            }
        });

        if (jupyterhubUser) {
            await deleteJupyterHubUser(user.username);
            await prisma.serviceRegistration.deleteMany({
                where: {
                    profileUserId: user.id,
                    name: 'JUPYTERHUB'
                }
            });
        }

        user = await prisma.user.delete({
            where: { username: user.username }
        });
    } catch (error) {
        logger.error(`Failed to delete user ${user.username} from OpenVPN and JupyterHub`);
    }

    return res.json(omit(user, 'password'));
}
