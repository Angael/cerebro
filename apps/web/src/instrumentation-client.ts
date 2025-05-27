// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { clientEnv } from './utils/clientEnv';

Sentry.init({
  enabled: clientEnv.IS_PROD,
  dsn: clientEnv.SENTRY_DSN,
  tracesSampleRate: 0.5,
  debug: false,
  environment: clientEnv.IS_PROD ? 'production' : 'development',
  beforeSendTransaction: (transaction) => {
    // Filter out react render duration spans, cause they are into the 1000s range, and eat up span limit
    if (transaction.spans) {
      transaction.spans = transaction.spans.filter((span) => span.op !== 'measure');
    }

    return transaction;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
