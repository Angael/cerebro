'use client'; // Error components must be Client Components

import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { Alert, Text } from '@mantine/core';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import css from './SimpleError.module.scss';

interface SimpleErrorProps {
  error?: any;
  title?: string;
  text?: string;
}

export default function SimpleError({ 
  error, 
  title = "Something went wrong", 
  text = "Try reloading the page." 
}: SimpleErrorProps) {
  const errorMsg = error ? parseErrorResponse(error) : null;

  useEffect(() => {
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <Alert color="red" title={title}>
      <Text mb="xs">{text}</Text>

      {error && (
        <details className={css.details} open={process.env.NODE_ENV !== 'production'}>
          <summary>Details</summary>
          <pre className={css.stack}>
            {error.name ?? 'Unknown'}: {JSON.stringify(errorMsg, null, 2)}
          </pre>
        </details>
      )}
    </Alert>
  );
}
