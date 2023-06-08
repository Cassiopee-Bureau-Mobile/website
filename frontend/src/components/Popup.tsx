import useOnClickOutside from '@/hooks/useOnClickOutside';
import useOnEchap from '@/hooks/useOnEchap';
import { useEffect, useRef, useState } from 'react';

interface PopupProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Popup = ({ children, isOpen, setIsOpen }: PopupProps) => {
    const ref = useRef<HTMLDialogElement>(null);
    const [_open, _setOpen] = useState(isOpen);

    const close = () => {
        _setOpen(false);
        setIsOpen(false);
    };

    useOnEchap(close);
    useOnClickOutside(ref, close);

    useEffect(() => {
        _setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (_open && ref.current?.open === false) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [_open]);

    return (
        <dialog
            ref={ref}
            className={`bg-gray-100 rounded-lg shadow-xl border-cyan-800 border min-h-[50vh] min-w-[35vw] ${_open ? 'flex' : 'hidden'}`}
            key='popup'
            id='popup'
            aria-label='popup'
            role='dialog'>
            <div className='flex flex-col grow'>
                <button
                    className='ml-auto flex justify-end max-w-min'
                    onClick={close}
                    aria-label='closeButton'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1}
                        stroke='currentColor'
                        className='w-12 h-12 text-gray-600 hover:text-gray-800'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </button>
                {children}
            </div>
        </dialog>
    );
};
