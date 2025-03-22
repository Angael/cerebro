import React from 'react';
import { Anchor, Group, Stack } from '@mantine/core';
import Link from 'next/link';

type Props = { children: React.ReactNode };

const layout = ({ children }: Props) => {
  return (
    <Stack gap="md">
      <Group gap="md">
        <Anchor component={Link} href="/admin/users">
          Users
        </Anchor>
        <Anchor component={Link} href="/admin/server-stats">
          Server stats
        </Anchor>
      </Group>
      {children}
    </Stack>
  );
};

export default layout;
