import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import Base from '@/layouts/base';
import { User } from '@prisma/client';
import { fetchData } from '@/utils/fetchClient';
import { HTTPError } from 'ky';
import PasswordForm from '@/components/PasswordForm';
import AuthCard from '@/components/AuthCard';
import { apiRoutes } from '@/utils/constants';

export default function ChangePassword(): JSX.Element {
    const { push, query } = useRouter();
    const [password, setPassword] = useState('');

    const errorRef = useRef<HTMLHeadingElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const changePassword = {
            password
        };
        try {
            await fetchData<User>(apiRoutes.users.resetPassword, {
                method: 'patch',
                json: changePassword,
                searchParams: { token: query.token as string }
            });
            toast.success('Le changement de mot de passe a bien été effectué');
            push('/');
        } catch (error) {
            if (error instanceof HTTPError) {
                switch (error.response.status) {
                    case 404:
                        toast.error('Le lien de réinitialisation du mot de passe est invalide');
                        push('/');
                        return;
                    case 400:
                        toast.error('Le lien de réinitialisation du mot de passe est expiré');
                        push('auth/forgot-password');
                        return;
                    case 422:
                        toast.error('Le mot de passe est invalide');
                        errorRef.current!.innerText = 'Le mot de passe est invalide';
                        return;
                    default:
                        toast.error(`Une erreur est survenue lors de la modification du mot de passe. Code ${error.response.status}`);
                        errorRef.current!.innerText = `Une erreur est survenue lors de la modification du mot de passe. Code ${error.response.status}`;
                        return;
                }
            }
        }
    };

    return (
        <Base title='Changement mot de passe'>
            <AuthCard>
                <h1 className='text-xl self-center font-semibold md:text-2xl'>Changement mot de passe</h1>
                <h3
                    className='font-bold text-red-600'
                    ref={errorRef}></h3>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <PasswordForm setPassword={setPassword} />
                    <Button type='submit'>Changer mon mot de passe</Button>
                </form>
            </AuthCard>
        </Base>
    );
}
