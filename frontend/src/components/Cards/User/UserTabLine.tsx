import { Button } from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import { logger } from '@/lib/logger';
import { useUser, useDeleteUser, useMutateUser } from '@/utils/fetchClient';
import { Role } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export default function UserTabLine({ username }: { username: string }): JSX.Element {
    const queryClient = useQueryClient();

    const { data, isLoading } = useUser(username);
    const mutation = useMutateUser(username);
    const deleteMutation = useDeleteUser(username);

    const onChangeRole = (role: Role) => {
        mutation.mutate(
            { role },
            {
                onSuccess: () => {
                    toast.success(`Le rôle de ${username} a été mis à jour avec succès !`);
                    queryClient.refetchQueries({ stale: true });
                },
                onError: (error) => {
                    toast.error(`Une erreur est survenue lors de la mise à jour du rôle de ${username}.`);
                    logger.error('UserTabLine', 'onChangeRole', error);
                }
            }
        );
    };

    const onDelete = () => {
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success(`L'utilisateur ${username} a été supprimé avec succès !`);
                queryClient.refetchQueries({ stale: true });
            },
            onError: (error) => {
                toast.error(`Une erreur est survenue lors de la suppression de l'utilisateur ${username}.`);
                logger.error('UserTabLine', 'onDelete', error);
            }
        });
    };

    if (isLoading) {
        return (
            <tr>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <Skeleton />;
                </td>
            </tr>
        );
    }

    logger.debug('UserTabLine', 'data', data);

    const services = data?.profile?.serviceRegistration.map((val) => val.name) ?? [];

    return (
        <tr>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                    <div className='ml-2'>
                        <div className='text-sm font-medium text-gray-900'>{data?.username}</div>
                        <div className='text-sm text-gray-500'>{data?.email}</div>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>{data?.profile?.lastName}</div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>{data?.profile?.firstName}</div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex flex-col gap-2 items-start'>
                    <div className='text-sm text-gray-900'>{data?.email}</div>
                    {data?.emailVerified !== null ? (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>Vérifié</span>
                    ) : (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>Non vérifié</span>
                    )}
                </div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>{new Date(data?.createdAt as any).toLocaleDateString()}</div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-900'>{data?.role}</div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex flex-col gap-2 items-start'>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${services.includes('JUPYTERHUB') ? 'text-green-800 bg-green-100 ' : 'text-red-800 bg-red-100 '}`}>JupyterHub</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 ${services.includes('OPENVPN') ? 'text-green-800 bg-green-100 ' : 'text-red-800 bg-red-100'}`}>OpenVPN</span>
                </div>
            </td>
            <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                <div className='flex justify-start items-center'>
                    <div className='flex items-center gap-4'>
                        <Button
                            confirm
                            loading={mutation.isLoading}
                            disabled={!(data?.role === 'INACTIVE' && data.emailVerified !== null)}
                            onClick={() => onChangeRole('USER')}>
                            Activer
                        </Button>
                        <Button
                            danger
                            loading={deleteMutation.isLoading}
                            disabled={data?.role === 'ADMIN'}
                            onClick={onDelete}>
                            Supprimer
                        </Button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
