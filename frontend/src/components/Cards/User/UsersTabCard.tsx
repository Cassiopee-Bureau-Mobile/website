import { Card } from '@/components/Card';
import { useUsers } from '@/utils/fetchClient';
import UserTabLine from './UserTabLine';

export default function UsersTabCard() {
    const { data } = useUsers();

    if (!data) {
        return null;
    }

    return (
        <Card className='lg:col-span-4'>
            <div className='justify-between sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>Utilisateurs</h5>
            </div>

            <div className='flex flex-col mt-8 text-slate-500 grow'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Utilisateur</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Nom</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Prénom</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Email</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Date de création</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Rôle</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Accès</th>
                            <th className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {data.map((user) => (
                            <UserTabLine
                                key={user.id}
                                username={user.username}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
