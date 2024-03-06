'use server';
import axios from 'redaxios';
import { NEXT_PUBLIC_API_URL } from '@/utils/env';

export const ApiServer = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: NEXT_PUBLIC_API_URL,
});

export const getApiHeaders = async (clerkAuth: { getToken: () => Promise<string | null> }) => {
  const token = await clerkAuth.getToken();

  if (!token) {
    return undefined;
  }

  return { Authorization: 'Bearer ' + token };
};
