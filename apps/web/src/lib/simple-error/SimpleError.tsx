'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import css from './SimpleError.module.scss';
import { Stack, Text, Title } from '@mantine/core';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import * as Sentry from '@sentry/nextjs';

export default function SimpleError({ error }: { error: any }) {
  const errorMsg = parseErrorResponse(error);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Stack component="article" justify="center" align="center" flex={1}>
      <Title order={1}>Something went wrong</Title>
      <Text>Try reloading the page.</Text>

      <details className={css.details} open={process.env.NODE_ENV !== 'production'}>
        <summary>Details</summary>
        <pre className={css.stack}>
          {error.name ?? 'Unknown'}: {JSON.stringify(errorMsg, null, 2)}
        </pre>
      </details>
    </Stack>
  );
}
