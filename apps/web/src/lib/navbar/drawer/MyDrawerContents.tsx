import React from 'react';
import { Flex, Paper, Stack, Title } from '@mantine/core';
import css from './MyDrawerContents.module.scss';
import { RouteNavLink } from '@/lib/route-nav-link/RouteNavLink';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { Icon } from '@mdi/react';
import {
  mdiAccountCircleOutline,
  mdiBook,
  mdiHome,
  mdiLogout,
  mdiShieldCrownOutline,
  mdiUpload,
} from '@mdi/js';
import { useRouter } from 'next/navigation';

type Props = {
  onClose?: () => void;
};

const MyDrawerContents = ({ onClose }: Props) => {
  const user = useCurrentUser();
  const router = useRouter();

  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: () => API.delete('/auth/signout').then((res) => res.data),
    onSettled: () => queryClient.invalidateQueries(),
  });

  return (
    <Stack className={css.MyDrawerContents} gap="md">
      <Paper p="md">
        <RouteNavLink
          href="/browse"
          label="Browse"
          description="Explore the library"
          onClick={onClose}
          leftSection={<Icon path={mdiHome} size="24px" />}
        />
        {user.data && (
          <RouteNavLink
            href="/upload"
            label="Upload"
            description="Pictures or short videos"
            onClick={onClose}
            leftSection={<Icon path={mdiUpload} size="24px" />}
          />
        )}
      </Paper>

      <Paper p="md">
        <Title component="header" order={3} ml="sm" mb="xs">
          Story
        </Title>
        <RouteNavLink
          href="/story/browse"
          label="Browse"
          description="Read stories"
          onClick={onClose}
          leftSection={<Icon path={mdiBook} size="24px" />}
        />
        {user.data && (
          <>
            <RouteNavLink
              href="/story/browse-my"
              label="Your stories"
              description="Create and manage your stories"
              onClick={onClose}
              leftSection={<Icon path={mdiHome} size="24px" />}
            />
          </>
        )}
      </Paper>

      <Paper p="md">
        {user.data?.type === 'ADMIN' && (
          <RouteNavLink
            href="/admin"
            label="Admin panel"
            leftSection={<Icon path={mdiShieldCrownOutline} size="24px" />}
            description="Manage the site"
          />
        )}
        <Flex gap="0" align="stretch">
          <RouteNavLink
            href={user.data ? '/account' : '/signin'}
            label={user.data ? user.data.email : 'My account'}
            description={user.data ? 'View your account' : 'Login'}
            onClick={onClose}
            leftSection={<Icon path={mdiAccountCircleOutline} size="24px" />}
            style={{ flex: 1 }}
          />
          {user.data && (
            <button
              className={css.logoutBtn}
              type="button"
              onClick={() => {
                logout.mutate();
                onClose?.();
                router.push('/signin');
              }}
            >
              <Icon path={mdiLogout} size="24px" />
            </button>
          )}
        </Flex>
      </Paper>
    </Stack>
  );
};

export default MyDrawerContents;
