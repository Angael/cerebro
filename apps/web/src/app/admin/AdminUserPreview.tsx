import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { AdminUsers_Endpoint, AdminUserPreview_Endpoint } from '@cerebro/shared';
import numeral from 'numeral';
import { Badge, Group, Paper, Progress, Text, Title } from '@mantine/core';

type Props = {
  userId: string;
  email: string;
  type: string;
  onClick: (userId: string) => void;
};

const badgeColors = {
  ADMIN: 'red',
  PREMIUM: 'blue',
  FREE: 'dark',
} as any;

const AdminUserPreview = ({ userId, email, type, onClick }: Props) => {
  const { data } = useQuery({
    retry: false,
    queryKey: [QUERY_KEYS.adminUserPreview, { userId }],
    queryFn: () =>
      API.get<AdminUserPreview_Endpoint>(`/admin/user-preview`, { params: { userId } }).then(
        (res) => res.data,
      ),
  });

  return (
    <Paper p="md" bg="gray.8" onClick={() => onClick(userId)}>
      <Text size="xs" c="gray.4">
        {userId}
      </Text>
      <Group>
        <Title order={3}>{email}</Title>
        <Badge bg={badgeColors[type]}>{type}</Badge>
      </Group>
      <Group>
        <Text>{data?.itemCount} Files</Text>
        <Text>
          {numeral(data?.usedSpace).format('0.00 b')} / {numeral(data?.maxSpace).format('0.00 b')}
        </Text>
      </Group>
      <Progress value={((data?.usedSpace || 0) / (data?.maxSpace || 1)) * 100} size="xl" />
    </Paper>
  );
};

export default AdminUserPreview;
