import { useRef, useState } from 'react';
import { ZxcvbnResult } from '@zxcvbn-ts/core';
import { zxcvbnPasswordStrength } from '@/lib/zxcvbn';

interface PasswordFormProps {
    setPassword: (password: string) => void;
}

export default function PasswordForm(props: PasswordFormProps): JSX.Element {
    const password1 = useRef<HTMLInputElement>(null);
    const password2 = useRef<HTMLInputElement>(null);

    // 5 random characters to make the password strength meter happy
    const randomString = Math.random().toString(36).substring(2, 7);

    const [zxcvbnResult, setzxcvbnResult] = useState<ZxcvbnResult>(zxcvbnPasswordStrength(''));

    const handlePassword2Change = () => {
        if (password1.current!.value !== password2.current!.value) {
            password2.current!.setCustomValidity('Les mots de passe ne correspondent pas');
        } else {
            password2.current!.setCustomValidity('');
        }
    };

    const handlePassword1Change = () => {
        const res = zxcvbnPasswordStrength(password1.current!.value);
        setzxcvbnResult(res);
        if (res.score < 4) {
            password1.current!.setCustomValidity(res.feedback.warning !== '' ? res.feedback.warning : 'Votre mot de passe ne correpond pas aux critères de sécurité');
            props.setPassword('');
        } else {
            password1.current!.setCustomValidity('');
            props.setPassword(password1.current!.value);
        }
    };

    return (
        <div className='flex flex-col gap-4 grow my-4'>
            <div>
                <label
                    htmlFor={`${randomString}_password1`}
                    className='text-sm font-semibold'>
                    Mot de passe
                </label>
                <div className='relative'>
                    <input
                        type='password'
                        name={`${randomString}_password1`}
                        id={`${randomString}_password1`}
                        placeholder='••••••••••••••••'
                        className='input w-full'
                        required
                        aria-label={`${randomString}_password1`}
                        autoComplete='new-password'
                        ref={password1}
                        onChange={handlePassword1Change}
                        onFocus={() => {
                            password1.current!.classList.add('input-error');
                        }}
                    />
                    <button
                        className='absolute right-0 top-0 mt-3 mr-3 focus:outline-none hover:text-gray-700'
                        type='button'
                        tabIndex={-1}
                        onMouseDown={() => (password1.current!.type = 'text')}
                        onTouchStart={() => (password1.current!.type = 'text')}
                        onMouseUp={() => (password1.current!.type = 'password')}
                        onTouchEnd={() => (password1.current!.type = 'password')}
                        onMouseLeave={() => (password1.current!.type = 'password')}>
                        <svg
                            className='h-4 w-4'
                            viewBox='0 0 24 24'>
                            <path
                                fill='currentColor'
                                d='M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z'></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                <label
                    htmlFor={`${randomString}_password2`}
                    className='text-sm font-semibold'>
                    Confirmez votre mot de passe
                </label>
                <div className='relative'>
                    <input
                        type='password'
                        name={`${randomString}_password2`}
                        id={`${randomString}_password2`}
                        placeholder='••••••••••••••••'
                        className='input w-full'
                        required
                        aria-label={`${randomString}_password2`}
                        autoComplete='new-password'
                        ref={password2}
                        onChange={handlePassword2Change}
                        onFocus={() => {
                            password2.current!.classList.add('input-error');
                        }}
                    />
                    <button
                        className='absolute right-0 top-0 mt-3 mr-3 focus:outline-none'
                        type='button'
                        tabIndex={-1}
                        onMouseDown={() => (password2.current!.type = 'text')}
                        onTouchStart={() => (password2.current!.type = 'text')}
                        onMouseUp={() => (password2.current!.type = 'password')}
                        onTouchEnd={() => (password2.current!.type = 'password')}
                        onMouseLeave={() => (password2.current!.type = 'password')}>
                        <svg
                            className='h-4 w-4 ml-1'
                            viewBox='0 0 24 24'>
                            <path
                                fill='currentColor'
                                d='M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z'></path>
                        </svg>
                    </button>
                </div>
            </div>
            <hr />
            <div>
                <div className='flex flex-col justify-between w-full'>
                    <div className='flex flex-row gap-2'>
                        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 0 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 1 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 2 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                        <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 3 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                    </div>
                    <div className='text-xs text-gray-500 mt-2'>
                        {zxcvbnResult.feedback.suggestions.map((suggestion, index) => (
                            <div key={index}>{suggestion}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function colorForPasswordValidator(score: number) {
    switch (score) {
        case 0:
            return 'bg-red-500';
        case 1:
            return 'bg-red-500';
        case 2:
            return 'bg-orange-500';
        case 3:
            return 'bg-yellow-500';
        case 4:
            return 'bg-green-500';
        default:
            return 'bg-gray-300';
    }
}
