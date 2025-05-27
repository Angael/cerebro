// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { clientEnv } from '@/utils/clientEnv';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: clientEnv.SENTRY_DSN,
  enabled: clientEnv.IS_PROD,
  tracesSampleRate: 0.5,
  debug: false,
  environment: clientEnv.IS_PROD ? 'production' : 'development',
});
