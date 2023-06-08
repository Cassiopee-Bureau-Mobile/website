import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { logger } from '@/lib/logger';
import { usePostUserData, useUserData } from '@/utils/fetchClient';
import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export default function UserModifyProfileCard() {
    const { data } = useUserData();
    const mutation = usePostUserData();

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(
            {
                firstName: firstNameRef.current?.value,
                lastName: lastNameRef.current?.value
            },
            {
                onSuccess: () => {
                    toast.success('Votre profil a été mis à jour avec succès !');
                    queryClient.refetchQueries({ stale: true });
                },
                onError: (error) => {
                    toast.error('Une erreur est survenue lors de la mise à jour de votre profil.');
                    logger.error('UserModifyProfileCard', 'onSubmit', error);
                }
            }
        );
    };

    return (
        <Card>
            <div className='justify-between sm:flex'>
                <h5 className='text-xl font-bold text-slate-900'>Modifier mon profil</h5>
            </div>

            <div className='flex flex-col mt-8 text-slate-500 grow'>
                <form
                    onSubmit={onSubmit}
                    className='flex flex-col grow'>
                    <div className='grid gap-2 gap-y-8 grid-cols-3 items-baseline'>
                        <label className='font-mono font-bold text-md col-span-1'>Prénom :</label>
                        <input
                            ref={firstNameRef}
                            type='text'
                            defaultValue={data?.firstName}
                            className='input ml-2 col-span-2'
                        />
                        <label className='font-mono font-bold text-md col-span-1'>Nom :</label>
                        <input
                            ref={lastNameRef}
                            type='text'
                            defaultValue={data?.lastName}
                            className='input ml-2 col-span-2'
                        />
                    </div>

                    <div className='grow'></div>
                    <hr className='my-4' />

                    <div className='flex justify-end'>
                        <Button type='submit'>Modifier</Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
