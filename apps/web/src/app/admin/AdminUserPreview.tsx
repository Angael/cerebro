import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { AdminUsers_Endpoint, AdminUserPreview_Endpoint } from '@cerebro/shared';
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
  // const { data } = useQuery({
  //   retry: false,
  //   queryKey: [QUERY_KEYS.adminUserPreview, { userId }],
  //   queryFn: () =>
  //     API.get<AdminUserPreview_Endpoint>(`/admin/user-preview`, { params: { userId } }).then(
  //       (res) => res.data,
  //     ),
  // });

  return (
    <Paper p="md" bg="gray.8" onClick={() => onClick(id)}>
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
