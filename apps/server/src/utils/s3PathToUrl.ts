import { env } from '@/utils/env.js';

export const s3PathToUrl = (s3Path: string | undefined): string => {
  return `${env.CF_CDN_URL}/${encodeURIComponent(s3Path ?? '')}`;
};
