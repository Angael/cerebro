import React from 'react';
import { AdminUsers_Endpoint } from '@cerebro/shared';
import numeral from 'numeral';
import { Badge, Group, Paper, Progress, Text, Title } from '@mantine/core';

type Props = {
  user: AdminUsers_Endpoint[number];
  onClick: (userId: string) => void;
};

const badgeColors = {
  ADMIN: 'red',
  PREMIUM: 'blue',
  FREE: 'dark',
} as any;

const AdminUserPreview = ({ user, onClick }: Props) => {
  const { id, type, email, maxSpace, usedSpace, itemCount } = user;

  return (
    <Paper p="md" onClick={() => onClick(id)}>
      <Text size="xs" c="gray.4">
        {id}
      </Text>
      <Group>
        <Title order={3}>{email}</Title>
        <Badge bg={badgeColors[type]}>{type}</Badge>
      </Group>
      <Group>
        <Text>{itemCount} Files</Text>
        <Text>
          {numeral(usedSpace).format('0.00 b')} / {numeral(maxSpace).format('0.00 b')}
        </Text>
      </Group>
      <Progress value={(usedSpace / (maxSpace || 1)) * 100} size="xl" />
    </Paper>
  );
};

export default AdminUserPreview;
