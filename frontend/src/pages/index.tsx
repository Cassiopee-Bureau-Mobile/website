import { useState } from 'react';
import { Button } from '@/components/Button';
import { Popup } from '@/components/Popup';
import { NextPage } from 'next';
import Base from '@/layouts/base';
import { queryKeys } from '@/utils/constants';
import { fetchSideMenu, fetchUserData } from '@/utils/fetchClient';
import { QueryClient, dehydrate } from '@tanstack/react-query';

const Home: NextPage = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Base
            title='Home'
            description='This is the home page'>
            <main className='flex flex-col items-center justify-center py-2'>
                <Button onClick={() => setIsOpen(true)}>Open popup</Button>
                <Popup
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}>
                    <h1 className='text-2xl font-bold'>Hello world</h1>
                    <p className='text-lg'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh
                        ultricies vehicula ut id elit. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies.
                    </p>
                </Popup>
            </main>
        </Base>
    );
};

export async function getStaticProps() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [queryKeys.sideMenu],
        queryFn: () => fetchSideMenu()
    });

    await queryClient.prefetchQuery({
        queryKey: [queryKeys.me],
        queryFn: () => fetchUserData()
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}

export default Home;