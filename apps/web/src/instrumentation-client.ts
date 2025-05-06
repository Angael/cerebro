// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { env } from './utils/env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: env.IS_PROD ? 1 : 0.1,
  debug: false,
  environment: env.IS_PROD ? 'production' : 'development',
  beforeSendTransaction: (transaction) => {
    // Filter out react render duration spans, cause they are into the 1000s range, and eat up span limit
    if (transaction.spans) {
      transaction.spans = transaction.spans.filter((span) => span.op !== 'measure');
    }

    return transaction;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
