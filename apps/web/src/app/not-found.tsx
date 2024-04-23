import React from 'react';
import { Stack } from '@mantine/core';

type Props = {};

const NotFound = () => {
  return (
    <Stack component="article" justify="center" align="center" flex={1}>
      <div>
        <h1 className="h1">404</h1>
        <p className="body1">Page not found</p>
      </div>
      <p className="body2">Please check the URL</p>
    </Stack>
  );
};

export default NotFound;
