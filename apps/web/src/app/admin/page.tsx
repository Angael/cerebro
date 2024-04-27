'use client';
import React from 'react';
import { AdminUsers_Endpoint } from '@cerebro/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { Anchor, Group, Paper, Stack, Title } from '@mantine/core';
import AdminUserPreview from '@/app/admin/AdminUserPreview';
import Link from 'next/link';
import AdminGuardedPage from '@/lib/admin/adminGuardedPage';
import adminGuardedPage from '@/lib/admin/adminGuardedPage';

const AdminPage = () => {
  return (
    <Stack gap="md">
      <Group>
        <Anchor component={Link} href="/admin/users">
          Users
        </Anchor>
        <Anchor component={Link} href="/admin/all-data">
          All data
        </Anchor>
      </Group>
    </Stack>
  );
};

export default adminGuardedPage(AdminPage);
