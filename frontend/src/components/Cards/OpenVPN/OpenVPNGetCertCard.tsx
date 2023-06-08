import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { apiRoutes } from '@/utils/constants';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function OpenVPNGetCertCard(): JSX.Element {
    const session = useSession();

    if (session.status !== 'authenticated') {
        return <></>;
    }

    const user = session.data.user.username;

    return (
        <Card>
            <div className='justify-between sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>Télécharger mon client OpenVPN</h5>
            </div>

            <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                <p className='mb-2'>Vous pouvez télécharger votre client OpenVPN afin de vous connecter au serveur.</p>
            </div>

            <div className='flex-grow'></div>

            <hr className='my-4' />

            <div className='mb-4 sm:pr-8'>
                <p className='text-sm text-slate-500'>Télécharger mon client OpenVPN :</p>
            </div>

            <div className='mb-2 flex w-full'>
                <Link
                    href={apiRoutes.services.openvpn.users.user(user)}
                    download={true}>
                    <Button>Télécharger</Button>
                </Link>
            </div>
        </Card>
    );
}
