import { useHost, usePostHost } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Popup } from '@/components/Popup';
import { logger } from '@/lib/logger';
import { toast } from 'react-hot-toast';

interface HostCardProps {
    type: Type;
}

export default function HostCard({ type }: HostCardProps): JSX.Element {
    const { data } = useHost(type);
    const mutation = usePostHost(type);

    const ansible_host_ref = useRef<HTMLInputElement>(null);
    const ansible_user_ref = useRef<HTMLInputElement>(null);
    const ansible_sudo_pass_ref = useRef<HTMLInputElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    const hostVars = {
        ansible_host: ansible_host_ref.current?.value || data?.ansible_host || '',
        ansible_user: ansible_user_ref.current?.value || data?.ansible_user || '',
        ansible_sudo_pass: ansible_sudo_pass_ref.current?.value || data?.ansible_sudo_pass || ''
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsOpen(true);
    };

    const onValidate = () => {
        setIsOpen(false);

        mutation.mutate(hostVars, {
            onSuccess: () => {
                toast.success("Les variables d'environnement ont été mises à jour avec succès !");
            },
            onError: (error) => {
                toast.error("Une erreur est survenue lors de la mise à jour des variables d'environnement.");
                logger.error('HostCard', 'onValidate', error);
            }
        });
    };

    return (
        <>
            <Card className='col-span-2'>
                <div className='justify-between sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>Variables d&apos;environnement de {type}</h5>
                </div>

                <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                    <p className='mb-2'>Les variables d&apos;environnement suivantes sont disponibles :</p>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>ANSIBLE_HOST</span>
                            <span className='text-sm text-slate-600'>Adresse IP du serveur</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>ANSIBLE_USER</span>
                            <span className='text-sm text-slate-600'>Nom d&apos;utilisateur</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>ANSIBLE_SUDO_PASS</span>
                            <span className='text-sm text-slate-600'>Mot de passe sudo</span>
                        </div>
                    </div>
                </div>

                <hr className='my-4' />

                <div className='sm:pr-8'>
                    <p className='text-sm text-slate-500'>Modification des variables d&apos;environnement :</p>
                </div>

                <div className='mt-4 sm:pr-8 ml-2'>
                    <form onSubmit={onSubmit}>
                        <div className='flex flex-col gap-4 mb-4'>
                            <div className='flex items-center gap-2 flex-wrap'>
                                <label
                                    htmlFor='ansible_host'
                                    className='font-mono font-bold'>
                                    ANSIBLE_HOST
                                </label>
                                {data === undefined ? (
                                    <Skeleton
                                        className='inline-block w-64'
                                        id='ansible_host'
                                    />
                                ) : (
                                    <input
                                        ref={ansible_host_ref}
                                        type='text'
                                        minLength={7}
                                        maxLength={15}
                                        size={15}
                                        pattern='^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$'
                                        id='ansible_host'
                                        name='ansible_host'
                                        className='input w-64'
                                        defaultValue={data.ansible_host}
                                    />
                                )}
                            </div>
                            <div className='flex items-center gap-2 flex-wrap'>
                                <label
                                    htmlFor='ansible_user'
                                    className='font-mono font-bold'>
                                    ANSIBLE_USER
                                </label>
                                {data === undefined ? (
                                    <Skeleton
                                        className='inline-block w-64'
                                        id='ansible_user'
                                    />
                                ) : (
                                    <input
                                        ref={ansible_user_ref}
                                        type='text'
                                        id='ansible_user'
                                        name='ansible_user'
                                        className='input w-64'
                                        defaultValue={data.ansible_user}
                                    />
                                )}
                            </div>
                            <div className='flex items-center gap-2 flex-wrap'>
                                <label
                                    htmlFor='ansible_sudo_pass'
                                    className='font-mono font-bold'>
                                    ANSIBLE_SUDO_PASS
                                </label>
                                {data === undefined ? (
                                    <Skeleton
                                        className='inline-block w-64'
                                        id='ansible_sudo_pass'
                                    />
                                ) : (
                                    <input
                                        ref={ansible_sudo_pass_ref}
                                        type='text'
                                        id='ansible_sudo_pass'
                                        name='ansible_sudo_pass'
                                        className='input w-64'
                                        defaultValue={data.ansible_sudo_pass}
                                    />
                                )}
                            </div>
                        </div>
                        <Button
                            type='submit'
                            loading={mutation.isLoading}>
                            Enregistrer
                        </Button>
                    </form>
                </div>
            </Card>
            <Popup
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <div className='flex flex-col gap-4'>
                    <h5 className='text-xl font-bold text-slate-900 mb-8'>Modification des variables d&apos;environnement de {type}</h5>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>ANSIBLE_HOST : </span>
                            <span className='text-md text-slate-600'>{hostVars.ansible_host}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>ANSIBLE_USER : </span>
                            <span className='text-md text-slate-600'>{hostVars.ansible_user}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>ANSIBLE_SUDO_PASS : </span>
                            <span className='text-md text-slate-600'>{hostVars.ansible_sudo_pass}</span>
                        </div>
                    </div>
                </div>
                <div className='grow'></div>
                <Button onClick={onValidate}>Valider</Button>
            </Popup>
        </>
    );
}
