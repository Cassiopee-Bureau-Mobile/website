import { useClientIp, useOpenVPNStatus } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import Skeleton from '@/components/Skeleton';

const statusMap = {
    up: 'En ligne',
    down: 'Hors ligne'
};

export default function OpenVPNUserCard({ openVpnIp }: { openVpnIp: string }): JSX.Element {
    const { data: data1 } = useOpenVPNStatus();
    const { data: data2 } = useClientIp();

    let color = 'bg-gray-300';

    if (data1 !== undefined) {
        color = data1.message === 'up' ? 'bg-green-500' : 'bg-red-500';
    }

    return (
        <Card className='lg:col-span-2'>
            <div className='justify-end sm:flex'>
                <div className='flex items-center justify-between mt-4 sm:mt-0'>
                    <div className='flex items-center gap-2'>
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        {data1 === undefined ? <Skeleton className={'w-12'} /> : <span className='text-sm font-medium text-slate-600'>{statusMap[data1.message]}</span>}
                    </div>
                </div>
            </div>

            <div className='justify-between sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>Etat du serveur OpenVPN</h5>
            </div>

            <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                <p className='mb-2'>Le serveur se trouve actuellement à l&apos;adresse suivante :</p>
                {data1 === undefined ? <Skeleton /> : <code className='font-mono font-bold pl-3'>{openVpnIp}</code>}
            </div>

            <div className='mt-4 sm:pr-8'>
                <p className='text-sm text-slate-500'>Détail de votre connexion :</p>
            </div>

            <div className='mt-4 sm:pr-8 ml-2'>
                <span className='text-sm text-slate-500'>Adresse IP :</span>
                {data2 === undefined ? <Skeleton className='inline-block w-32' /> : <code className='font-mono font-bold text-slate-600 pl-3'>{data2.ip}</code>}
            </div>

            <span className={`absolute inset-x-0 -bottom-[1px] h-2 rounded-b-md ${color}`}></span>
        </Card>
    );
}
