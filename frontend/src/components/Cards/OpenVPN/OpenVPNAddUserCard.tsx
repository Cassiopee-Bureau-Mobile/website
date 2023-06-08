import { Card } from '@/components/Card';
import EventStreamButton from '@/components/EventStreamButton';
import { apiRoutes } from '@/utils/constants';
import { useOpenVPNStatus } from '@/utils/fetchClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function OpenVPNAddUserCard(): JSX.Element {
    const session = useSession();

    const { data: status } = useOpenVPNStatus();

    const router = useRouter();
    const refresh = () => router.replace(router.asPath);

    if (session.status !== 'authenticated') {
        return <></>;
    }

    return (
        <Card>
            <div className='justify-between sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>Générer mon client OpenVPN</h5>
            </div>

            <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                <p className='mb-2'>Vous pouvez demander l&apos;ajout d&apos;une configuration au serveur OpenVPN afin de vous connecter à celui-ci.</p>
            </div>

            <div className='flex-grow'></div>

            <hr className='my-4' />

            <div className='mb-4 sm:pr-8'>
                <p className='text-sm text-slate-500'>Faire ma demande :</p>
            </div>

            <div className='mb-2 flex w-full'>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type='text'
                        name='openvpn_username'
                        id='openvpn_username'
                        autoComplete='off'
                        className='sr-only'
                        value={session.data.user.username}
                        readOnly
                    />
                    <EventStreamButton
                        onSuccessfulInstall={refresh}
                        url={apiRoutes.services.openvpn.users.index}
                        title={`Demander l'ajout d'un client OpenVPN`}
                        toastErrorMessage="Une erreur est survenue lors de la demande d'ajout d'un client OpenVPN."
                        toastSuccessMessage='La demande a été effectuée avec succès !'
                        type='submit'
                        disabled={status === undefined || status.message === 'down'}
                        options={{
                            method: 'POST',
                            json: {
                                user: session.data.user.username
                            }
                        }}>
                        Valider
                    </EventStreamButton>
                </form>
            </div>
        </Card>
    );
}
