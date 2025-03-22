'use client';
import React from 'react';
import { AdminUsers_Endpoint } from '@cerebro/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { Paper, Stack, Title, Loader } from '@mantine/core';
import AdminUserPreview from '@/app/admin/users/AdminUserPreview';
import adminGuardedPage from '@/lib/admin/adminGuardedPage';
import PageLoader from '@/lib/page-loader/PageLoader';

const AdminUsersPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId')!;

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.adminAllUsers],
    queryFn: () => API.get<AdminUsers_Endpoint>(`/admin/all-users`).then((res) => res.data),
  });

  const onClickUser = (userId: string) => {
    router.replace(`?userId=${userId}`, { scroll: false });
  };

  const sortedUsers = data ? [...data].sort((a, b) => b.usedSpace - a.usedSpace) : [];

  if (!data) {
    return <PageLoader />;
  }

  return (
    <Stack gap="md">
      <Title order={1} mb="md">
        Users:
      </Title>
      <Stack>
        {sortedUsers.map((user) => (
          <AdminUserPreview key={user.id} user={user} onClick={onClickUser} />
        ))}
      </Stack>

      {userId && (
        <Paper p="md">
          <Title order={1}>UserId: {userId}</Title>
          userId: {userId}
        </Paper>
      )}
    </Stack>
  );
};

export default adminGuardedPage(AdminUsersPage);
