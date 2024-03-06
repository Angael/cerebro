'use server';
import { auth } from '@clerk/nextjs';
import { ApiServer, getApiHeaders } from '@/utils/api.server';

export const uploadFileFromLink = async (link: string) => {
  const clerkToken = auth();

  const response = await ApiServer.post(
    '/items/upload/file-from-link',
    { link },
    {
      headers: await getApiHeaders(clerkToken),
    },
  );

  return response.body;
};
