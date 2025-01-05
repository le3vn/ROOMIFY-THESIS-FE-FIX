import React from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import Router from 'next/router';
import NProgress from 'nprogress';
import { SessionProvider } from 'next-auth/react';
import { SessionErrorHandler } from '../components/SessionErrorHandler';
import { config } from '@fortawesome/fontawesome-svg-core';
import '../styles/globals.css';

config.autoAddCss = false;

type NextPageWithLayout = NextPage & {
    layout?: (page: React.ReactElement) => React.ReactNode;
}

type AppPropsWithLayout = AppProps<{
    session?: Session;
}> & {
    Component: NextPageWithLayout;
}

function CustomApp({
    Component,
    pageProps: { session, ...pageProps }
}: AppPropsWithLayout): JSX.Element {
    // Use the layout defined in the page or default to a simple wrapper
    const withLayout = Component.layout ?? (page => page);
    return (
        <SessionProvider session={session} refetchInterval={120} refetchWhenOffline={false} refetchOnWindowFocus={false}>
                <SessionErrorHandler>
                    {withLayout(<Component {...pageProps} />)}
                </SessionErrorHandler>
        </SessionProvider>
    );
}

NProgress.configure({
    showSpinner: false
});

// Progress bar for route changes
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

export default CustomApp;
