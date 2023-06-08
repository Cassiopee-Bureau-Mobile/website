import { signOut } from 'next-auth/react';
import React from 'react';

export default function logout() {
    signOut({ callbackUrl: '/' });
    return <div></div>;
}
