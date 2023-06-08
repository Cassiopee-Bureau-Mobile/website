import { getIcon } from '@/styles/svg_utils';
import Link from 'next/link';

interface TabProps {
    href: Page['href'];
    icon: Page['icon'];
    name: Page['name'];
    active: boolean;
    folded: boolean;
}

export default function Tab({ href, icon, name, active, folded }: TabProps) {
    if (folded) {
        return (
            <Link
                href={href}
                className='flex max-w-fit items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700'>
                {getIcon(icon, `w-5 h-5 ${active === true ? 'stroke-2' : 'stroke-[1.5]'}`)}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className='flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700'>
            {getIcon(icon)}
            <span className={`mx-2 text-sm ${active === true ? 'font-bold' : 'font-medium'}`}>{name}</span>
        </Link>
    );
}
