// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { env } from './utils/env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 0.5,
  debug: false,
  environment: env.IS_PROD ? 'production' : 'development',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
