import '@/styles/global.scss';

import React from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

type SideBarContextProps = [sideBarFolded: boolean, setSideBarFolded: React.Dispatch<React.SetStateAction<boolean>>];

const SideBarContext = React.createContext<SideBarContextProps>([false, () => {}]);

export default function MyApp({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());
    const [sideBarFolded, setSideBarFolded] = React.useState(false);

    return (
        <SessionProvider session={pageProps.session}>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <SideBarContext.Provider value={[sideBarFolded, setSideBarFolded]}>
                        <Component {...pageProps} />
                    </SideBarContext.Provider>
                </Hydrate>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </SessionProvider>
    );
}

const useSideBarContext = () => React.useContext(SideBarContext);

export { useSideBarContext };
