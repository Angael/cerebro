'use client';
import axios from 'redaxios';
import { clientEnv } from '@/utils/clientEnv';

export const API = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: clientEnv.API_URL,
  withCredentials: true,
});
