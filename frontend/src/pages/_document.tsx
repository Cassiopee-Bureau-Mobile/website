import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html
            lang='fr'
            className='scroll-smooth'>
            <Head>
                <link
                    rel='icon'
                    href='/favicon.png'
                />
            </Head>
            <body className='bg-slate-50'>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
