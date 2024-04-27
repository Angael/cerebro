'use client';
import React from 'react';
import { Loader, Title } from '@mantine/core';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';

type Props = { children: React.ReactNode };
const AdminGuard = ({ children }: Props) => {
  const user = useCurrentUser();

  if (user.isFetched && user.data?.type !== 'ADMIN') {
    return <Title order={1}>Access denied</Title>;
  } else if (!user.isFetched) {
    return <Loader />;
  }

  return children;
};

// eslint-disable-next-line react/display-name
const adminGuardedPage = (Page: React.FC) => () => (
  <AdminGuard>
    <Page />
  </AdminGuard>
);

export default adminGuardedPage;
