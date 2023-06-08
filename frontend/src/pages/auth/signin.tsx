import AuthCard from '@/components/AuthCard';
import { Button } from '@/components/Button';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { pages } from '@/utils/constants';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';

export default function Login() {
    const { query, push } = useRouter();
    const { data: session, status } = useSession();
    const errorRef = useRef<HTMLHeadingElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formDetails = new FormData(e.currentTarget);
        const username = formDetails.get('username') as string;
        const password = formDetails.get('password') as string;

        // Get the redirection URL from the query string after the login sucess
        const redirect = Array.isArray(query.redirect) ? query.redirect[0] ?? '/' : query.redirect ?? '/';

        try {
            const res = await signIn('credentials', {
                username,
                password,
                callbackUrl: redirect
            });
        } catch (err) {
            logger.error(err);
            return;
        }
    };

    if (status === 'authenticated') {
        push('/', {
            query: {
                callbackUrl: query.redirect
            }
        });
    }

    if (query.error && errorRef.current !== null && query.error === 'CredentialsSignin') {
        errorRef.current.innerText = "Nom d'utilisateur ou mot de passe incorrect";
    }

    return (
        <Base title='Connection'>
            <AuthCard>
                <h1 className='text-xl self-center font-semibold md:text-2xl'>Connectez-vous</h1>
                <h3
                    className='font-bold text-red-600'
                    ref={errorRef}></h3>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4'>
                        <label
                            htmlFor='username'
                            className='text-sm font-semibold'>
                            Nom d&apos;utilisateur
                        </label>
                        <input
                            type='text'
                            name='username'
                            id='username'
                            autoComplete='username'
                            placeholder="Nom d'utilisateur"
                            className='input w-full'
                            required
                            aria-label='username'
                        />
                        <label
                            htmlFor='password'
                            className='text-sm font-semibold'>
                            Mot de passe
                        </label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            autoComplete='current-password'
                            placeholder='••••••••••••••••'
                            className='input w-full'
                            required
                            aria-label='password'
                        />
                        <Link
                            href={pages.forgotPassword}
                            className='text-sm text-gray-500 hover:text-gray-700 mb-4'>
                            Mot de passe oublié ? <span className='underline'>Réinitialiser</span>
                        </Link>
                    </div>
                    <Button type='submit'>Se connecter</Button>
                </form>
                <Link
                    href={pages.signup}
                    className='text-sm text-gray-500 hover:text-gray-700'>
                    Vous n&apos;avez pas de compte ? <span className='underline'>Inscrivez-vous</span>
                </Link>
            </AuthCard>
        </Base>
    );
}
