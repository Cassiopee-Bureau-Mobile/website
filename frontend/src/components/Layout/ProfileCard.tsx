import { getIcon } from '@/styles/svg_utils';
import { useUserData } from '@/utils/fetchClient';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Skeleton from '@/components/Skeleton';
import { pages } from '@/utils/constants';

export default function ProfileCard({ folded }: { folded: boolean }): JSX.Element {
    const session = useSession();
    const { data } = useUserData();

    if (session.status === 'unauthenticated') {
        return (
            <div className='flex items-center justify-between mt-3'>
                <Link
                    href={pages.signin}
                    className='flex flex-grow items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700'>
                    <span
                        className='text-md font-medium text-gray-700 dark:text-gray-200 ml-4'
                        hidden={folded}>
                        Se connecter
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-between mt-6'>
            <Link
                href={pages.dashboard}
                style={folded ? { display: 'none' } : {}}
                className='flex flex-grow items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 mr-2'>
                {data === undefined ? (
                    <Skeleton />
                ) : (
                    <span
                        className='text-md font-medium text-gray-700 dark:text-gray-200 ml-2'
                        hidden={folded}>
                        {data.firstName} {data.lastName}
                    </span>
                )}
            </Link>

            <Link
                href={pages.signout}
                className='text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400 mx-auto mr-2'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    style={{ maxWidth: '3rem', maxHeight: '3rem' }}
                    stroke='currentColor'
                    className='w-5 h-5'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
                    />
                </svg>
            </Link>
        </div>
    );
}
