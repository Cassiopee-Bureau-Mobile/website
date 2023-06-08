import { useJupyterHubStatus, fetchData, usePostJupyterHubUrl, useFetchIpStatus } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { Button } from '@/components/Button';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Popup } from '@/components/Popup';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/router';
import { apiRoutes } from '@/utils/constants';

const statusMap = {
    up: 'Opérationnel',
    down: 'Arrêté'
};

export default function JupyterHubServerCard({ jupyterHubUrl, jupyterHubIp, installed }: { jupyterHubUrl: string; jupyterHubIp: string; installed: boolean }): JSX.Element {
    const { data } = useJupyterHubStatus();
    const { data: ipStatus } = useFetchIpStatus(jupyterHubIp);

    const mutateUrl = usePostJupyterHubUrl();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const refresh = () => router.replace(router.asPath);

    const urlRef = useRef<HTMLInputElement>(null);

    let color = 'bg-gray-300';

    if (data !== undefined) {
        color = data.message === 'up' ? 'bg-green-500' : 'bg-red-500';
    }

    const onRestart = async () => {
        setIsOpen(false);
        setIsLoading(true);
        try {
            await fetchData<ApiMessage>(apiRoutes.services.jupyterhub.index, {
                method: 'POST'
            });
            toast.success('Le serveur a été redémarré avec succès !');
        } catch (e) {
            toast.error('Une erreur est survenue lors du redémarrage du serveur.');
        }
        setIsLoading(false);
    };

    const onModifyUrl = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (urlRef.current === null) {
            return;
        }

        const url = urlRef.current.value;

        mutateUrl.mutate(url, {
            onSuccess: () => {
                toast.success("L'URL a été modifiée avec succès !");
                refresh();
            },
            onError: (err) => {
                toast.error("Une erreur est survenue lors de la modification de l'URL.");
                logger.error('onModifyUrl', err);
            }
        });
    };

    return (
        <>
            <Card className='lg:col-span-2'>
                <div className='justify-end sm:flex'>
                    <div className='flex items-center justify-between mt-4 sm:mt-0'>
                        <div className='flex items-center gap-2'>
                            <div className={`w-3 h-3 rounded-full ${color}`}></div>
                            {data === undefined ? <Skeleton className={'w-12'} /> : <span className='text-sm font-medium text-slate-600'>{statusMap[data.message]}</span>}
                        </div>
                    </div>
                </div>

                <div className='justify-start sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>Etat du service JupyterHub</h5>
                </div>

                <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                    <p className='mb-2'>
                        Le serveur se trouve actuellement à l&apos;adresse suivante : <span>{data === undefined ? <Skeleton /> : <code className='font-mono font-bold pl-3'>{jupyterHubUrl}</code>}</span>
                    </p>
                </div>

                <hr className='my-4' />

                <div className='sm:pr-8 text-sm text-slate-500'>
                    <p className='mb-4'>
                        Si vous avez une entrée DNS, vous pouvez la faire pointer vers l&apos;IP suivante :<code className='font-mono font-bold pl-3'>{jupyterHubIp}</code>
                    </p>
                    <form onSubmit={onModifyUrl}>
                        <div className='flex items-center gap-2 flex-wrap mb-2'>
                            <label
                                htmlFor='jupyter_url'
                                className='font-mono font-bold'>
                                Modifier l&apos;url du serveur :
                            </label>
                            <input
                                ref={urlRef}
                                type='text'
                                id='jupyter_url'
                                name='jupyter_url'
                                className='input w-64'
                                defaultValue={jupyterHubUrl}
                            />
                        </div>
                        <Button type='submit'>Modifier</Button>
                    </form>
                </div>

                <div className='grow'></div>
                <hr className='my-4' />
                <div className='mb-2 flex justify-end flex-wrap gap-4'>
                    <Button
                        danger
                        disabled={ipStatus === undefined || ipStatus.message === 'down' || !installed}
                        loading={isLoading}
                        onClick={() => setIsOpen(true)}>
                        Redémarrer le service
                    </Button>
                </div>
                <span className={`absolute inset-x-0 -bottom-[1px] h-2 rounded-b-md ${color}`}></span>
            </Card>
            <Popup
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xl font-bold text-slate-900'>Redémarrer le serveur JupyterHub</h3>
                    <p className='text-md text-slate-500'>Etes-vous sûr de vouloir redémarrer le serveur JupyterHub ?</p>
                </div>
                <div className='grow'></div>
                <div className='flex justify-end gap-4'>
                    <Button onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button
                        danger
                        onClick={onRestart}>
                        Redémarrer
                    </Button>
                </div>
            </Popup>
        </>
    );
}
