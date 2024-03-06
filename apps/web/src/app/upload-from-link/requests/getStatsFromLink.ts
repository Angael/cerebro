'use server';

import { ApiServer, getApiHeaders } from '@/utils/api.server';
import { auth } from '@clerk/nextjs';

export const getStatsFromLink = async (link: string) => {
  const clerkToken = auth();

  const response = await ApiServer.get('/items/upload/file-from-link', {
    params: { link },
    headers: await getApiHeaders(clerkToken),
  });

  return response.data;
};
