// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from '@/utils/env';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: env.SENTRY_DSN,
  enabled: env.IS_PROD,
  tracesSampleRate: 0.5,
  debug: false,
  environment: env.IS_PROD ? 'production' : 'development',
});
