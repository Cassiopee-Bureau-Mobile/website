import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import CredentialsProvider from 'next-auth/providers/credentials';
import { hashPassword } from '@/utils/utils';
import { pages } from '@/utils/constants';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials, req) => {
                if (credentials === undefined) {
                    return null;
                }
                const user = await prisma.user.findFirst({
                    where: {
                        username: credentials.username
                    },
                    select: {
                        id: true,
                        username: true,
                        password: true,
                        email: true,
                        role: true
                    }
                });

                if (user && user.password === hashPassword(credentials.password) && user.role !== 'INACTIVE') {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    // pages
    pages: {
        signIn: pages.signin,
        signOut: pages.signout
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
    logger: {
        error: (code, metadata) => {
            logger.error(code, metadata);
        },
        warn: (code) => {
            logger.warn(code);
        },
        debug: (code, metadata) => {
            logger.debug(code, metadata);
        }
    },
    session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
    callbacks: {
        // Getting the JWT token from API response
        jwt: async ({ token, user, account }) => {
            const isSigningIn = user ? true : false;
            if (isSigningIn) {
                token.user = {
                    username: user.username,
                    email: user.email!,
                    role: user.role
                };
            }
            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {
            const isSigningIn = token ? true : false;
            if (isSigningIn) {
                session.user = {
                    username: token.user.username,
                    email: token.user.email,
                    role: token.user.role
                };
                session.id = token.sub!;
            }
            return Promise.resolve(session);
        }
    }
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
