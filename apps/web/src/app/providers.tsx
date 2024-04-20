'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { queryClient } from '@/utils/queryClient';

export function Providers(props: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
