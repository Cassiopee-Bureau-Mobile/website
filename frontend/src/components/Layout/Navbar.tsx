import Link from 'next/link';
import { Button } from '@/components/Button';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useSideMenu } from '@/utils/fetchClient';
import { usePathname } from 'next/navigation';
import ProfileCard from './ProfileCard';
import Tab from './Tab';
import { pages } from '@/utils/constants';

export default function Navbar(): JSX.Element {
    const { data, isLoading } = useSideMenu();
    const pathname = usePathname();
    const session = useSession();
    const [isOpen, setIsOpen] = useState(false);

    let display = true;
    if (isLoading || data === undefined || session.status !== 'authenticated') {
        display = false;
    }

    return (
        <>
            <nav className='flex items-center justify-between flex-wrap sm:px-6 px-2 py-3 border-b'>
                <h1 className='sm:text-3xl text-2xl uppercase font-semibold bg-gradient-to-r from-green-600 via-blue-500 to-purple-600 bg-clip-text text-transparent'>SafeOfficeAnywhere</h1>
                {session.status === 'unauthenticated' && (
                    <div className='hidden md:block'>
                        <Button>
                            <Link href={pages.signin}>Se connecter</Link>
                        </Button>
                    </div>
                )}
                <div className='block md:hidden'>
                    <div
                        id='hamburger-menu'
                        aria-label='hamburger-menu'
                        onClick={() => setIsOpen(!isOpen)}
                        className={(isOpen ? 'active ' : '') + 'md:hidden'}>
                        <span className='bg-gray-600 dark:bg-gray-300'></span>
                        <span className='bg-gray-600 dark:bg-gray-300'></span>
                        <span className='bg-gray-600 dark:bg-gray-300'></span>
                    </div>
                </div>
            </nav>
            <div className={(isOpen ? 'block ' : 'hidden ') + 'md:hidden border-b'}>
                {display && (
                    <div className='flex flex-col justify-between pt-8'>
                        <div className='gap-y-6 flex flex-col'>
                            {data.map((item, index) => {
                                if (item.role === 'ADMIN' && session.data!.user.role !== 'ADMIN') return <></>;
                                return (
                                    <div
                                        className='gap-y-3 flex flex-col'
                                        key={index}>
                                        <div>
                                            <h3 className={`px-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 overflow-hidden text-ellipsis`}>{item.label}</h3>
                                        </div>
                                        {item.pages.map((page, index) => (
                                            <Tab
                                                key={index}
                                                active={pathname === page.href}
                                                folded={false}
                                                {...page}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className='grow'></div>
                <ProfileCard folded={false} />
            </div>
        </>
    );
}
