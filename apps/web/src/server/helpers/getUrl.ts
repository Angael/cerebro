import { headers } from 'next/headers';

export const getUrl = async () => (await headers()).get('x-url')!;
