import type { Metadata } from 'next';
import '@/style/global.scss';
import css from './layout.module.scss';
import Navbar from '@/lib/navbar/Navbar';
import React from 'react';

import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: 'Cerebro',
  description: 'Meme sharing website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={''} />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wdth,wght@0,75..100,300..800;1,75..100,300..800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={css.body}>
          <Navbar />
          <div className={css.Layout}>{children}</div>
        </body>
      </html>
    </Providers>
  );
}
