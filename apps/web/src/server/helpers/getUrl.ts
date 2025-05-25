import { headers } from 'next/headers';
import { cache } from 'react';

export const getUrl = cache(async () => (await headers()).get('x-url')!);
