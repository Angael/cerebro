'use client';
import React from 'react';
import { AdminAllUsers } from '@cerebro/shared';
import { useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { List, Paper, Stack, Title } from '@mantine/core';

const AdminPage = () => {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId')!;

  const { data } = useQuery({
    enabled: user.data?.type === 'ADMIN',
    queryKey: [QUERY_KEYS.adminAllUsers],
    queryFn: () => API.get<AdminAllUsers>(`/admin/all-users`).then((res) => res.data),
  });

  if (user.isFetched && user.data?.type !== 'ADMIN') {
    return <Title order={1}>Access denied</Title>;
  }

  return (
    <Stack>
      <Paper p="md">
        <Title order={1}>All users</Title>
        <List>{data?.map((user) => <List.Item key={user.id}>{user.email}</List.Item>)}</List>
      </Paper>
    </Stack>
  );
};

export default AdminPage;
