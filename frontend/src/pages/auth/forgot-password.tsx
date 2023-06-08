import { useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import Base from '@/layouts/base';
import { User } from '@prisma/client';
import { fetchData } from '@/utils/fetchClient';
import { HTTPError } from 'ky';
import { logger } from '@/lib/logger';
import AuthCard from '@/components/AuthCard';
import { apiRoutes, pages } from '@/utils/constants';

export default function Register(): JSX.Element {
    const { push } = useRouter();
    const email = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailForm = {
            email: email.current!.value
        };
        try {
            await fetchData<User>(apiRoutes.users.resetPassword, {
                method: 'POST',
                json: emailForm
            });
            toast.success('Votre demande de reinitialisation de mot de passe a bien été prise en compte, vous allez recevoir un email avec un lien de reinitialisation');
            push('/');
        } catch (error) {
            if (error instanceof HTTPError) {
                switch (error.response.status) {
                    case 400:
                        toast.error(`Votre compte n'a pas encore été validé par un administrateur`);
                        return;
                    case 404:
                        toast.error(`Aucun compte n'a été trouvé avec cette adresse email`);
                        return;
                    case 422:
                        toast.error(`L'adresse email n'est pas valide`);
                        return;
                }
            }
            logger.error(error);
            toast.error(`Une erreur est survenue lors de la tentative de reinitialisation du mot de passe`);
        }
    };

    return (
        <Base title='Création de compte'>
            <AuthCard>
                <h1 className='text-xl self-center font-semibold md:text-2xl'>Mot de passe oublié</h1>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 p-2 mt-8'>
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
                        <p className='text-sm text-gray-500'>Un email vous sera envoyé pour réinitialiser votre mot de passe.</p>
                    </div>
                    <Button type='submit'>Valider</Button>
                </form>
                <Link
                    href={pages.signin}
                    className='text-sm text-gray-500 hover:text-gray-700 mt-4'>
                    Retour à la page de connexion. <span className='underline'>Connectez-vous</span>
                </Link>
            </AuthCard>
        </Base>
    );
}
