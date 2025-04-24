'use client'; // Error components must be Client Components

import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { Alert, Text } from '@mantine/core';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import css from './SimpleError.module.scss';

export default function SimpleError({ error }: { error: any }) {
  const errorMsg = parseErrorResponse(error);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Alert color="red" title="Something went wrong">
      <Text mb="xs">Try reloading the page.</Text>

      <details className={css.details} open={process.env.NODE_ENV !== 'production'}>
        <summary>Details</summary>
        <pre className={css.stack}>
          {error.name ?? 'Unknown'}: {JSON.stringify(errorMsg, null, 2)}
        </pre>
      </details>
    </Alert>
  );
}
