import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import SideBar from '@/components/Layout/SideBar';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

export interface Props {
    title: string;
    description?: string;
    children: JSX.Element;
}

export default function Base({ children, title, description }: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name='description'
                    content={description}
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>
            <Navbar />
            <section className='flex-grow flex'>
                <aside>
                    <SideBar />
                </aside>
                <main className='flex-grow flex flex-col text-gray-700 p-4'>{children}</main>
            </section>
            <Toaster
                position='bottom-right'
                toastOptions={{ style: { maxWidth: 500 }, duration: 5000 }}
            />
            <Footer />
        </>
    );
}
