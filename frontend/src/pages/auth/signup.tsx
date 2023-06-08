import { useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import Base from '@/layouts/base';
import { User } from '@prisma/client';
import { fetchData } from '@/utils/fetchClient';
import PasswordForm from '@/components/PasswordForm';
import AuthCard from '@/components/AuthCard';
import { apiRoutes, pages } from '@/utils/constants';
import { HTTPError } from 'ky';

export default function Register(): JSX.Element {
    const { push } = useRouter();

    const username = useRef<HTMLInputElement>(null);
    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const account = {
            username: username.current!.value,
            password,
            firstName: firstName.current!.value,
            lastName: lastName.current!.value,
            email: email.current!.value
        };
        try {
            await fetchData<User>(apiRoutes.users.index, {
                method: 'POST',
                json: account
            });
            toast.success('Votre compte a bien été créé ! Un administrateur validera votre inscription dans les plus brefs délais.');
            push('/');
        } catch (error: any) {
            if (error instanceof HTTPError) {
                if (error.response.status === 422) toast.error("Ce nom d'utilisateur où email est déjà utilisé.");
                if (error.response.status === 400) toast.error('Informations invalide.');
                if (error.response.status === 409) toast.error('Mot de passe trop faible.');
            } else toast.error(`Une erreur est survenue lors de la création de votre compte.`);
        }
    };

    return (
        <Base title='Création de compte'>
            <AuthCard>
                <h1 className='text-xl self-center font-semibold md:text-2xl'>Création du compte</h1>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 p-2'>
                        <div>
                            <label
                                htmlFor='firstName'
                                className='text-sm font-semibold'>
                                Prénom
                            </label>
                            <input
                                type='text'
                                name='firstName'
                                id='firstName'
                                placeholder='Prénom'
                                className='input w-full'
                                required
                                aria-label='firstName'
                                ref={firstName}
                                onBlur={() => {
                                    firstName.current!.classList.add('input-error');
                                }}
                            />
                            <label
                                htmlFor='lastName'
                                className='text-sm font-semibold'>
                                Nom de famille
                            </label>
                            <input
                                type='text'
                                name='lastName'
                                id='lastName'
                                placeholder='Nom de famille'
                                className='input w-full'
                                required
                                aria-label='lastName'
                                ref={lastName}
                                onBlur={() => {
                                    lastName.current!.classList.add('input-error');
                                }}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='username'
                                className='text-sm font-semibold'>
                                Nom d&apos;utilisateur (uniquement des lettres et des chiffres)
                            </label>
                            <input
                                type='text'
                                name='username'
                                id='username'
                                placeholder="Nom d'utilisateur"
                                className='input w-full'
                                required
                                pattern='[a-zA-Z0-9]+' // Only alphanumeric characters
                                aria-label='username'
                                ref={username}
                                onBlur={() => {
                                    username.current!.classList.add('input-error');
                                }}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='email'
                                className='text-sm font-semibold'>
                                Adresse email
                            </label>
                            <input
                                type='email'
                                name='email'
                                id='email'
                                placeholder='exemple@exemple.com'
                                className='input w-full'
                                required
                                aria-label='email'
                                ref={email}
                                onBlur={() => {
                                    email.current!.classList.add('input-error');
                                }}
                            />
                        </div>
                        <PasswordForm setPassword={setPassword} />
                    </div>
                    <Button type='submit'>Créer un compte</Button>
                </form>
                <Link
                    href={pages.signin}
                    className='text-sm text-gray-500 hover:text-gray-700 mt-4'>
                    Vous avez déjà un compte ? <span className='underline'>Connectez-vous</span>
                </Link>
            </AuthCard>
        </Base>
    );
}
