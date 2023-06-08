import { Button } from '@/components/Button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Popup } from '@/components/Popup';
import { logger } from '@/lib/logger';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ButtonProps } from './Button';
import { Options } from 'ky';
import { useQueryClient } from '@tanstack/react-query';

interface EventStreamButtonProps extends ButtonProps {
    title: string;
    toastSuccessMessage: string;
    toastErrorMessage: string;
    url: string;
    options?: Options;
    onSuccessfulInstall?: () => void;
}

export default function EventStreamButton(props: EventStreamButtonProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [running, setRunning] = useState(false);
    const [fillPercentage, setFillPercentage] = useState(0);

    const queryClient = useQueryClient();

    const disabled = props.disabled || running;

    const onInstall = () => {
        setRunning(true);
        setIsOpen(false);
        const abortController = new AbortController();
        const signal = abortController.signal;
        const end = () => {
            setFillPercentage(0);
            setRunning(false);
            abortController.abort();
            queryClient.refetchQueries({ stale: true });
        };
        fetchEventSource(props.url, {
            async onopen(res) {
                if (res.ok) {
                    return; // everything's good
                } else {
                    // An error is thrown before receiving any data
                    toast.error(`${props.toastErrorMessage}\n\n${((await res.json()) as ApiError).error}`);
                    end();
                }
            },
            onmessage(ev) {
                if (ev.event === 'end') {
                    toast.success(props.toastSuccessMessage);
                    props.onSuccessfulInstall?.();
                    end();
                } else if (ev.event === 'percentage') {
                    setFillPercentage(Number(ev.data) * 100);
                } else if (ev.event === 'error') {
                    logger.error(ev.data);
                    toast.error(props.toastErrorMessage);
                    end();
                }
            },
            openWhenHidden: true,
            method: props.options?.method ?? 'GET',
            body: JSON.stringify(props.options?.json),
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                disabled={disabled}
                loading={running}
                fillPercentage={fillPercentage}>
                {running ? <span>Opération en cours...</span> : props.children}
            </Button>
            <Popup
                isOpen={isOpen}
                setIsOpen={setIsOpen}>
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xl font-bold text-slate-900'>{props.title}</h3>
                    <p className='text-md text-slate-500'>
                        Etes-vous sûr de vouloir effectuer cette action ?<br />
                    </p>
                </div>
                <div className='grow'></div>
                <div className='flex justify-end gap-4'>
                    <Button onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button
                        confirm
                        onClick={onInstall}>
                        Valider
                    </Button>
                </div>
            </Popup>
        </>
    );
}
