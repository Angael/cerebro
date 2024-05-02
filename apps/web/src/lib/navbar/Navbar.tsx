'use client';
import React from 'react';
import css from './Navbar.module.scss';
import Link from 'next/link';
import Icon from '@mdi/react';
import {
  mdiAccount,
  mdiCog,
  mdiLogout,
  mdiMonitorDashboard,
  mdiUpload,
  mdiViewGrid,
} from '@mdi/js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { ActionIcon, Text } from '@mantine/core';

const Navbar = () => {
  const user = useCurrentUser();

  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: () => API.delete('/auth/signout').then((res) => res.data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] }),
  });

  return (
    <header className={css.navbar}>
      <div className={css.navbarBg}>
        <div className={css.navbarFlex}>
          <Text size="1.5rem" fw={700} component="h1" style={{ marginRight: 'auto' }}>
            <Link href="/" className={css.cerebroLogo}>
              Cerebro
            </Link>
          </Text>

          {user.data && (
            <ActionIcon variant="transparent" component={Link} href="/upload">
              <Icon path={mdiUpload} />
            </ActionIcon>
          )}

          <ActionIcon variant="transparent" component={Link} href="/browse">
            <Icon path={mdiViewGrid} />
          </ActionIcon>

          {user.data && (
            <ActionIcon variant="transparent" component={Link} href="/account">
              <Icon path={mdiAccount} />
            </ActionIcon>
          )}

          {user.data?.type === 'ADMIN' && (
            <ActionIcon variant="transparent" component={Link} href="/admin">
              <Icon path={mdiMonitorDashboard} />
            </ActionIcon>
          )}

          {user.data ? (
            <ActionIcon
              variant="transparent"
              onClick={() => logout.mutate()}
              style={{ opacity: logout.isPending ? 0.5 : 1 }}
            >
              <Icon path={mdiLogout} />
            </ActionIcon>
          ) : (
            <ActionIcon variant="transparent" component={Link} href="/signin" title="Login">
              <Icon path={mdiAccount} />
            </ActionIcon>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
