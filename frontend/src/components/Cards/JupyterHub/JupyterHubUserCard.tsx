import { useJupyterUser } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import { getFirstValue } from '@/utils/utils';
import { Button } from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function JupyterHubUserCard({ jupyterHubUrl }: { jupyterHubUrl: string }): JSX.Element {
    const session = useSession();
    const [name, setName] = useState<string>('');
    const { isLoading, data } = useJupyterUser(name);

    useEffect(() => {
        if (session.status === 'authenticated') {
            setName(session.data.user.username);
        }
    }, [session]);

    const title = 'Etat de votre serveur sur le service JupyterHub';

    if (isLoading || data === undefined || session.status === 'unauthenticated') {
        return (
            <Card className='lg:col-span-2'>
                <div className='justify-end sm:flex'>
                    <div className='flex items-center justify-between mt-4 sm:mt-0'>
                        <div className='flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-gray-300'></div>
                            <Skeleton className={'w-12'} />
                        </div>
                    </div>
                </div>
                <div className='justify-between sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>{title}</h5>
                </div>
                <Skeleton className={'mt-8'} />
                <span className='absolute inset-x-0 -bottom-[1px] h-2 rounded-b-md bg-gray-300'></span>
            </Card>
        );
    }

    if (data.status === 'host-down') {
        return (
            <Card className='lg:col-span-2'>
                <div className='justify-end sm:flex'>
                    <div className='flex items-center justify-between mt-4 sm:mt-0'>
                        <div className='flex items-center gap-2'>
                            <div className={`w-3 h-3 rounded-full bg-red-500`}></div>
                            <span className='text-sm font-medium text-slate-600'>Service Indisponible</span>
                        </div>
                    </div>
                </div>
                <div className='justify-between sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>{title}</h5>
                </div>
                <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                    <p className='mb-2'>
                        Bonjour <b>{name}</b>, le service JupyterHub est actuellement indisponible.
                    </p>
                </div>
                <span className='absolute inset-x-0 -bottom-[1px] h-2 rounded-b-md bg-red-500'></span>
            </Card>
        );
    }

    let color = 'bg-red-500';
    let serverStatus = 'Inexistant';
    let serverFullUrl = jupyterHubUrl;
    let serverStarted = 'N/A';
    let serverLastActivity = 'N/A';
    let serverUptime = 'N/A';

    let serverStartedState = false;

    if (data.status === 'registred') {
        // Get the first key of the servers object
        const server = getFirstValue<Servers, Server>(data.data.servers);

        let uptime = 0;

        if (server !== undefined) {
            server.started = new Date(server.started);
            server.last_activity = new Date(server.last_activity);
            uptime = Math.floor((Date.now() - server.started.getTime()) / 1000 / 3600);
        }

        color = server === undefined || server.stopped === true ? 'bg-red-500' : 'bg-green-500';
        serverStatus = server === undefined || server.stopped === true ? 'Stopped' : 'Running';
        serverFullUrl = jupyterHubUrl + (data.data.server ?? '');

        serverStarted = server?.started.toLocaleString() ?? 'N/A';
        serverLastActivity = server?.last_activity.toLocaleString() ?? 'N/A';
        serverUptime = uptime > 0 ? `${uptime} hours` : 'N/A';
        serverStartedState = server !== undefined;
    }

    let message = '';
    if (data.status === 'unregistred') {
        message = "vous n'êtes pas enregistré sur le service JupyterHub";
    } else if (serverStartedState === true) {
        message = "votre serveur se trouve actuellement à l'adresse suivante :";
    } else {
        message = "vous n'avez pas de serveur actif actuellement.";
    }

    return (
        <Card className='lg:col-span-2'>
            <div className='justify-end sm:flex'>
                <div className='flex items-center justify-between mt-4 sm:mt-0'>
                    <div className='flex items-center gap-2'>
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <span className='text-sm font-medium text-slate-600'>{serverStatus}</span>
                    </div>
                </div>
            </div>

            <div className='justify-start sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>{title}</h5>
            </div>

            <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                <p className='mb-2'>
                    Bonjour <b>{name}</b>, {message}
                </p>
                {serverStartedState === true && <code className='font-mono font-bold pl-3 break-words'>{serverFullUrl}</code>}
            </div>

            <div className='mt-4 sm:pr-8'>
                <p className='text-sm text-slate-500'>Détails du serveur :</p>
            </div>

            <dl className='flex my-4 flex-wrap gap-x-12 gap-y-4'>
                <div className='flex flex-col-reverse'>
                    <dt className='text-sm font-medium text-slate-600'>Started</dt>
                    <dd className='text-xs text-slate-500'>{serverStarted}</dd>
                </div>

                <div className='flex flex-col-reverse'>
                    <dt className='text-sm font-medium text-slate-600'>Last activity</dt>
                    <dd className='text-xs text-slate-500'>{serverLastActivity}</dd>
                </div>

                <div className='flex flex-col-reverse'>
                    <dt className='text-sm font-medium text-slate-600'>Uptime</dt>
                    <dd className='text-xs text-slate-500'>{serverUptime}</dd>
                </div>
            </dl>

            {data.status !== 'unregistred' && (
                <>
                    <div className='mt-4 sm:pr-8'>
                        <p className='text-sm text-slate-500'>Vous pouvez vous connecter à votre serveur en cliquant sur le bouton ci-dessous :</p>
                    </div>

                    <div className='mt-4 sm:pr-8 mb-2'>
                        <Button onClick={() => window.open(serverFullUrl, '_blank')}>Se connecter</Button>
                    </div>
                </>
            )}

            <span className={`absolute inset-x-0 -bottom-[1px] h-2 rounded-b-md ${color}`}></span>
        </Card>
    );
}
