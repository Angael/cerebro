'use client';
import axios from 'redaxios';
import { NEXT_PUBLIC_API_URL } from '@/utils/env';

export const ApiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: NEXT_PUBLIC_API_URL,
});
