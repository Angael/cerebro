import React from 'react';
import { Stack, Text, Title } from '@mantine/core';

type Props = {};

const NotFound = () => {
  return (
    <Stack component="article" justify="center" align="center" flex={1}>
      <div style={{ textAlign: 'center' }}>
        <Title order={1}>404</Title>
        <Text>Page not found.</Text>
      </div>
      <Text size="sm" c="gray.6">
        Please check the URL
      </Text>
    </Stack>
  );
};

export default NotFound;
