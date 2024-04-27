'use client';
import React from 'react';
import { Title } from '@mantine/core';
import adminGuardedPage from '@/lib/admin/adminGuardedPage';

const AdminPage = () => {
  return <Title order={1}>Admin page</Title>;
};

export default adminGuardedPage(AdminPage);
