'use server';
import { auth } from '@clerk/nextjs';
import { ApiServer, getApiHeaders } from '@/utils/api.server';
import { GetUploadLimits } from '@cerebro/shared';

export const fetchAccountLimits = async (): Promise<GetUploadLimits> => {
  const clerkToken = auth();

  const limitsResponse = await ApiServer.get('/account/limits', {
    headers: await getApiHeaders(clerkToken),
  });

  return limitsResponse.data;
};
