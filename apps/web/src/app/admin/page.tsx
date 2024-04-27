'use client';
import React from 'react';
import { AdminUsers_Endpoint } from '@cerebro/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { Paper, Stack, Title } from '@mantine/core';
import AdminUserPreview from '@/app/admin/AdminUserPreview';

const AdminPage = () => {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId')!;

  const { data } = useQuery({
    enabled: user.data?.type === 'ADMIN',
    queryKey: [QUERY_KEYS.adminAllUsers],
    queryFn: () => API.get<AdminUsers_Endpoint>(`/admin/all-users`).then((res) => res.data),
  });

  if (user.isFetched && user.data?.type !== 'ADMIN') {
    return <Title order={1}>Access denied</Title>;
  } else if (!user.isFetched) {
    return <Title order={1}>Loading...</Title>;
  }

  const onClickUser = (userId: string) => {
    router.replace(`?userId=${userId}`, { scroll: false });
  };

  return (
    <Stack gap="md">
      <Paper p="md" bg="transparent" withBorder>
        <Title order={1} mb="md">
          All users
        </Title>
        <Stack>
          {data?.map((user) => (
            <AdminUserPreview
              key={user.id}
              userId={user.id}
              email={user.email}
              type={user.type}
              onClick={onClickUser}
            />
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
