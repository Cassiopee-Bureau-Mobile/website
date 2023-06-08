import { Role } from '@prisma/client';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            username: string;
            email?: string;
            role: Role;
        };
        id: string;
    }
    interface User {
        username: string;
        email?: string;
        role: Role;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        user: {
            username: string;
            email?: string;
            role: Role;
        };
    }
}
