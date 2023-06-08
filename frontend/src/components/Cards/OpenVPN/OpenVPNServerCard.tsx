import { fetchData, useClientIp, useFetchIpStatus, useOpenVPNStatus } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/Button';
import { Popup } from '@/components/Popup';
import { apiRoutes } from '@/utils/constants';

const statusMap = {
    up: 'Opérationnel',
    down: 'Arrêté'
};

export default function OpenVPNServerCard({ openVpnIp, installed }: { openVpnIp: string; installed: boolean }): JSX.Element {
    const { data } = useOpenVPNStatus();
    const { data: ipStatus } = useFetchIpStatus(openVpnIp);
    const [isOpen, setIsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    let color = 'bg-gray-300';

    if (data !== undefined) {
        color = data.message === 'up' ? 'bg-green-500' : 'bg-red-500';
    }

    const onRestart = async () => {
        setIsOpen(false);
        setIsLoading(true);
        try {
            await fetchData<ApiMessage>(apiRoutes.services.openvpn.index, {
                method: 'POST'
            });
            toast.success('Le serveur a été redémarré avec succès !');
        } catch (e) {
            toast.error('Une erreur est survenue lors du redémarrage du serveur.');
        }
        setIsLoading(false);
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

                <div className='justify-between sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>Etat du service OpenVPN</h5>
                </div>

                <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                    <p className='mb-2'>Le serveur se trouve actuellement à l&apos;adresse suivante :</p>
                    {data === undefined ? <Skeleton /> : <code className='font-mono font-bold pl-3'>{openVpnIp}</code>}
                </div>
                <div className='grow'></div>
                <hr className='my-4' />
                <div className='mt-4 mb-2 flex justify-end flex-wrap gap-4'>
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
                    <h3 className='text-xl font-bold text-slate-900'>Redémarrer le serveur OpenVPN</h3>
                    <p className='text-md text-slate-500'>Etes-vous sûr de vouloir redémarrer le serveur OpenVPN ?</p>
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
