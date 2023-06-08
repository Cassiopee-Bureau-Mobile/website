import { Card } from '@/components/Card';
import EventStreamButton from '@/components/EventStreamButton';
import PasswordForm from '@/components/PasswordForm';
import { apiRoutes } from '@/utils/constants';
import { useJupyterHubStatus } from '@/utils/fetchClient';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function JupyterHubModifyUserCard(): JSX.Element {
    const session = useSession();
    const { data: status } = useJupyterHubStatus();

    const [password, setPassword] = React.useState('');

    if (session.status !== 'authenticated') {
        return <></>;
    }

    const user = session.data.user.username;

    return (
        <Card className='lg:col-span-3 lg:row-span-2'>
            <div className='justify-between sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>Modifier mon mot de passe JupyterHub</h5>
            </div>

            <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                <p className='mb-2'>Vous pouvez demander la modification de votre mot de passe JupyterHub.</p>
            </div>

            <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                <p className='mb-2'>Spécifier le mot de passe que vous souhaitez utiliser pour vous connecter à JupyterHub.</p>
                <p className='mb-2'>
                    Votre nom d&apos;utilisateur sera: <span className='font-bold ml-4'>{session.data.user.username}</span>
                </p>
            </div>

            <div className='mb-2 flex w-full grow'>
                <form
                    className='w-full flex grow flex-col'
                    onSubmit={(e) => e.preventDefault()}>
                    <input
                        type='text'
                        name='jupyter_username'
                        id='jupyter_username'
                        className='sr-only'
                        autoComplete='off'
                        value={user}
                        readOnly
                        hidden
                    />

                    <div className='pl-8 pr-16'>
                        <PasswordForm setPassword={setPassword} />
                    </div>

                    <div className='flex-grow'></div>
                    <hr className='my-4' />

                    <div className='mb-4 sm:pr-8'>
                        <p className='text-sm text-slate-500'>Faire ma demande :</p>
                    </div>
                    <div>
                        <EventStreamButton
                            url={apiRoutes.services.jupyterhub.users.user(user)}
                            title={`Demander la modification du mot de passe du JupyterHub`}
                            toastErrorMessage='Une erreur est survenue lors de la demande de modification du mot de passe JupyterHub.'
                            toastSuccessMessage='La demande a été effectuée avec succès !'
                            type='submit'
                            disabled={status === undefined || status.message === 'down'}
                            options={{
                                method: 'PUT',
                                json: {
                                    password
                                }
                            }}>
                            Valider
                        </EventStreamButton>
                    </div>
                </form>
            </div>
        </Card>
    );
}
