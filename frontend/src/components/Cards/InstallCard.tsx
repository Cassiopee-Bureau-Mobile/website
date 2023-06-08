import { useFetchIpStatus } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import EventStreamButton from '@/components/EventStreamButton';
import { apiRoutes } from '@/utils/constants';
import { useRouter } from 'next/router';

const statusMap = {
    up: 'Joignable',
    down: 'Injoignable'
};

export default function InstallCard({ ip, type, installed }: { ip: string; type: Type; installed: boolean }): JSX.Element {
    const { data } = useFetchIpStatus(ip);

    const router = useRouter();
    const refresh = () => router.replace(router.asPath);

    let color = 'bg-gray-300';

    if (data !== undefined) {
        color = data.message === 'up' ? 'bg-green-500' : 'bg-red-500';
    }

    return (
        <>
            <Card className='col-span-2'>
                <div className='justify-end sm:flex'>
                    <div className='flex items-center justify-between mt-4 sm:mt-0'>
                        <div className='flex items-center gap-2'>
                            <div className={`w-3 h-3 rounded-full ${color}`}></div>
                            {data === undefined ? <Skeleton className={'w-12'} /> : <span className='text-sm font-medium text-slate-600'>{statusMap[data.message]}</span>}
                        </div>
                    </div>
                </div>
                <div className='justify-between sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>Installation du serveur {type}</h5>
                </div>

                <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                    <p className='mb-2'>Le serveur se trouve actuellement à l&apos;adresse IP suivante :</p>
                    {data === undefined ? <Skeleton /> : <code className='font-mono font-bold pl-3'>{ip}</code>}
                </div>

                <div className='flex-grow'></div>
                <hr className='my-4' />

                <div className='mb-4 sm:pr-8'>
                    <p className='text-sm text-slate-500'>Vous pouvez vous installer le serveur {type} en cliquant sur le bouton ci-dessous.</p>
                </div>

                <div className='mb-2 flex w-full'>
                    <EventStreamButton
                        url={apiRoutes.services[type.toLowerCase()].install}
                        onSuccessfulInstall={refresh}
                        title={`Installer le serveur ${type}`}
                        toastErrorMessage="Une erreur est survenue lors de l'installation du serveur."
                        toastSuccessMessage='Le serveur a été installé avec succès !'
                        disabled={data === undefined || data.message === 'down' || installed}>
                        Installer
                    </EventStreamButton>
                </div>
                <span className={`absolute inset-x-0 -bottom-[1px] h-2 rounded-b-md ${color}`}></span>
            </Card>
        </>
    );
}
