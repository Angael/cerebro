'use client';
import React from 'react';
import { AdminAllUsers } from '@cerebro/shared';
import { useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { Paper, Stack, Title } from '@mantine/core';
import AdminUserPreview from '@/app/admin/AdminUserPreview';

const AdminPage = () => {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId')!;

  const { data } = useQuery({
    enabled: user.data?.type === 'ADMIN',
    queryKey: [QUERY_KEYS.adminAllUsers],
    queryFn: () => API.get<AdminAllUsers>(`/admin/all-users`).then((res) => res.data),
  });

  if (user.isFetched && user.data?.type !== 'ADMIN') {
    return <Title order={1}>Access denied</Title>;
  } else if (!user.isFetched) {
    return <Title order={1}>Loading...</Title>;
  }

  return (
    <Stack gap="md">
      <Paper p="md">
        <Title order={1}>All users</Title>
        <Stack>
          {data?.map((user) => (
            <AdminUserPreview key={user.id} userId={user.id} email={user.email} type={user.type} />
          ))}
        </Stack>
      </Paper>
      {userId && (
        <Paper p="md">
          <Title order={1}>UserId: {userId}</Title>
          userId: {userId}
        </Paper>
      )}
    </Stack>
  );
};

export default AdminPage;
