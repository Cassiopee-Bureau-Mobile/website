import Tab from './Tab';
import ProfileCard from './ProfileCard';
import { useSideMenu } from '@/utils/fetchClient';
import { usePathname } from 'next/navigation';
import { useSideBarContext } from '@/pages/_app';
import { useSession } from 'next-auth/react';

export default function SideBar(): JSX.Element {
    const { data, isLoading } = useSideMenu();
    const pathname = usePathname();

    const session = useSession();

    const [isFolded, setIsFolded] = useSideBarContext();

    if (isLoading || data === undefined || session.status !== 'authenticated') {
        return <></>;
    }

    return (
        <aside className={`flex-col h-full px-3 pt-4 pb-6 border-r ${isFolded ? 'w-[4.250rem]' : 'w-64'} bg-slate-50 z-10 hidden md:flex`}>
            <div className='items-center justify-end mb-4 flex'>
                <button
                    className='rounded-lg focus:outline-1 outline-cyan-500 focus:shadow-outline'
                    onClick={() => setIsFolded(!isFolded)}>
                    <svg
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        className='w-10 h-6 px-2'>
                        {isFolded ? (
                            <path
                                fill='currentColor'
                                d='M7.15 21.1q-.375-.375-.375-.888t.375-.887L14.475 12l-7.35-7.35q-.35-.35-.35-.875t.375-.9q.375-.375.888-.375t.887.375l8.4 8.425q.15.15.213.325T17.6 12q0 .2-.063.375t-.212.325L8.9 21.125q-.35.35-.863.35T7.15 21.1Z'></path>
                        ) : (
                            <path
                                fill='currentColor'
                                d='M9.125 21.1L.7 12.7q-.15-.15-.213-.325T.425 12q0-.2.063-.375T.7 11.3l8.425-8.425q.35-.35.875-.35t.9.375q.375.375.375.875t-.375.875L3.55 12l7.35 7.35q.35.35.35.863t-.375.887q-.375.375-.875.375t-.875-.375Z'></path>
                        )}
                    </svg>
                </button>
            </div>
            <div className='flex flex-col justify-between grow'>
                <div className='gap-y-6 flex flex-col'>
                    {data.map((item, index) => {
                        if (item.role === 'ADMIN' && session.data.user.role !== 'ADMIN') return <></>;
                        return (
                            <div
                                className='gap-y-3 flex flex-col'
                                key={index}>
                                <div>
                                    <h3 className={`${isFolded ? '' : 'px-3'} text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 overflow-hidden text-ellipsis`}>{item.label}</h3>
                                </div>
                                {item.pages.map((page, index) => (
                                    <Tab
                                        key={index}
                                        active={pathname === page.href}
                                        folded={isFolded}
                                        {...page}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
            <ProfileCard folded={isFolded} />
        </aside>
    );
}
