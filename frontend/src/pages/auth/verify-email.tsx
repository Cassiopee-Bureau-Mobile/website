import { useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import Base from '@/layouts/base';
import { User } from '@prisma/client';
import { fetchData } from '@/utils/fetchClient';
import { HTTPError } from 'ky';
import AuthCard from '@/components/AuthCard';
import { apiRoutes } from '@/utils/constants';

export default function VerifyEmail(): JSX.Element {
    const { push, query } = useRouter();

    const errorRef = useRef<HTMLHeadingElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await fetchData<User>(apiRoutes.users.verifyEmail, {
                method: 'patch',
                searchParams: { token: query.token as string }
            });
            toast.success('Le mail à bien été validé');
            push('/');
        } catch (error) {
            if (error instanceof HTTPError) {
                toast.error("Le lien de validation de l'email est invalide ou vous avez déjà validé votre email");
                errorRef.current!.innerText = 'Lien invalide';
            }
        }
    };

    return (
        <Base title='Changement mot de passe'>
            <AuthCard>
                <h1 className='text-xl self-center font-semibold md:text-2xl'>Valider mon mail</h1>
                <h3
                    className='font-bold text-red-600'
                    ref={errorRef}></h3>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 p-2 grow mb-4'></div>
                    <Button type='submit'>Valider mon mail</Button>
                </form>
            </AuthCard>
        </Base>
    );
}
