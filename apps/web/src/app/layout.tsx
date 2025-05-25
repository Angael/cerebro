import '@/style/global.scss';
import type { Metadata } from 'next';
import React from 'react';
import css from './layout.module.scss';

import { Providers } from '@/app/providers';
import LayoutDrawer from '@/lib/navbar/drawer/LayoutDrawer';
import NavbarParent from '@/lib/navbar/NavbarParent';
import { theme } from '@/utils/mantineTheme';
import { env } from '@/utils/env';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export const metadata: Metadata = {
  title: env.IS_PROD ? 'Cerebro' : 'Cerebro (Dev)',
  description: 'Stuff sharing website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en" data-mantine-color-scheme="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={''} />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@0,75..100,300..800;1,75..100,300..800&display=optional"
            rel="stylesheet"
          />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          {env.IS_PROD ? (
            // Production favicons
            <>
              <link rel="shortcut icon" href="/favicon.ico" />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </>
          ) : (
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32 dev.png" />
          )}
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#1e293b" />
          <meta name="theme-color" content="#1e293b" />
          <ColorSchemeScript forceColorScheme="dark" />
        </head>
        <body className={css.body}>
          <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme="dark">
            <NavbarParent />
            <div className={css.Layout}>
              <LayoutDrawer />
              <div className={css.LayoutStack}>{children}</div>
            </div>
            <Notifications />
          </MantineProvider>
        </body>
      </html>
    </Providers>
  );
}
