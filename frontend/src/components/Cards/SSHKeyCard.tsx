import { useHost, usePostHost, usePostSSHKey, useSSHKey } from '@/utils/fetchClient';
import { Card } from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Popup } from '@/components/Popup';
import { logger } from '@/lib/logger';
import { toast } from 'react-hot-toast';

interface SSHKeyCardProps {
    type: Type;
}

const regex = /\s*(\bBEGIN\b).*(PRIVATE KEY\b)\s*/;

export default function SSHKeyCard({ type }: SSHKeyCardProps): JSX.Element {
    const { data } = useSSHKey(type);
    const mutation = usePostSSHKey(type);

    const ansible_ssh_key_ref = useRef<HTMLTextAreaElement>(null);

    const [isOpen, setIsOpen] = useState(false);

    const sshKeyVars: SSHKey = {
        ssh_key: ansible_ssh_key_ref.current?.value || data?.ssh_key || ''
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (sshKeyVars.ssh_key.match(regex)) {
            ansible_ssh_key_ref.current?.setCustomValidity('');
            setIsOpen(true);
        } else {
            ansible_ssh_key_ref.current?.setCustomValidity("La clé SSH n'est pas valide");
        }
    };

    const onValidate = () => {
        setIsOpen(false);
        logger.info('SSHKeyCard', 'onClosed', sshKeyVars);

        mutation.mutate(sshKeyVars, {
            onSuccess: () => {
                toast.success('La clé SSH a été mise à jour avec succès !');
            },
            onError: (error) => {
                toast.error('Une erreur est survenue lors de la mise à jour de la clé SSH.');
                logger.error('SSHKeyCard', 'onValidate', error);
            }
        });
    };

    return (
        <>
            <Card className='col-span-2'>
                <div className='justify-between sm:flex'>
                    <h5 className='text-xl font-bold text-slate-900'>Clé SSH pour la connexion à {type}</h5>
                </div>

                <div className='mt-8 sm:pr-8 text-sm text-slate-500'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>SSH_KEY</span>
                            <span className='text-sm text-slate-600'>
                                Clé SSH, elle doit correspondre au <code>ANSIBLE_USER</code>
                            </span>
                        </div>
                    </div>
                </div>

                <hr className='my-4' />

                <div className='sm:pr-8'>
                    <p className='text-sm text-slate-500'>Modification de la clé SSH :</p>
                </div>

                <div className='mt-4 sm:pr-8 ml-2 flex grow'>
                    <form
                        onSubmit={onSubmit}
                        className='flex flex-col grow'>
                        <div className='flex flex-col gap-4 mb-4 grow'>
                            <div className='flex flex-col gap-2 flex-wrap grow'>
                                <label
                                    htmlFor='ansible_ssh_key'
                                    className='font-mono font-bold'>
                                    SSH_KEY :
                                </label>
                                {data === undefined ? (
                                    <Skeleton
                                        className='inline-block w-64'
                                        id='ansible_ssh_key'
                                    />
                                ) : (
                                    <textarea
                                        ref={ansible_ssh_key_ref}
                                        id='ansible_ssh_key'
                                        required
                                        name='ansible_ssh_key'
                                        className='input min-h-[10rem] grow'
                                        defaultValue={data.ssh_key}
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <Button
                                type='submit'
                                loading={mutation.isLoading}>
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
            <Popup
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <div className='flex flex-col gap-4 mb-4 grow'>
                    <h5 className='text-xl font-bold text-slate-900 mb-8'>Modification de la clé SSH de {type}</h5>
                    <div className='flex flex-col gap-2 grow'>
                        <div className='flex items-center gap-2'>
                            <span className='font-mono font-bold'>SSH_KEY</span>
                        </div>
                        <textarea
                            className='input grow'
                            readOnly
                            name='ansible_ssh_key'
                            value={sshKeyVars.ssh_key}
                        />
                    </div>
                </div>
                <Button onClick={onValidate}>Valider</Button>
            </Popup>
        </>
    );
}
