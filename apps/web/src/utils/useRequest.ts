import { useAuth } from '@clerk/nextjs';
import axios from 'redaxios';

export const useRequest = () => {
  const auth = useAuth();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    transformRequest: [
      async (data, headers) => {
        // TODO:  This clearly doesn't work, but it's a good starting point
        console.log('transforming elo');
        const token = await auth.getToken();

        if (headers) {
          (headers as any)['Authorization'] = `Bearer ${token}`;
        }

        console.log('elo', token, headers, data);

        return data;
      },
    ],
  });
};
