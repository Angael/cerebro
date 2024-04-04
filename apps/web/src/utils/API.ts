'use client';
import axios from 'redaxios';
import { env } from '@/utils/env';

export const API = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: env.API_URL,
});
