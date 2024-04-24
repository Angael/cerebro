'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import css from './SimpleError.module.scss';
import { Stack, Text, Title } from '@mantine/core';

export default function SimpleError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Stack component="article" justify="center" align="center" flex={1}>
      <Title order={1}>Something went wrong</Title>
      <Text>Try reloading the page.</Text>

      <details className={css.details} open={process.env.NODE_ENV !== 'production'}>
        <summary>Details</summary>
        <pre className={css.stack}>
          {process.env.NODE_ENV === 'production'
            ? `${error.name}: ${error.message}`
            : error.stack?.split('\n').map((line, i) => <Text key={i}>{line}</Text>)}
        </pre>
      </details>
    </Stack>
  );
}
