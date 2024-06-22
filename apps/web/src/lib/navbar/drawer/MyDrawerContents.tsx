import React from 'react';
import { Paper, Stack } from '@mantine/core';
import css from './MyDrawerContents.module.scss';
import { RouteNavLink } from '@/lib/route-nav-link/RouteNavLink';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { Icon } from '@mdi/react';
import {
  mdiAccountCircleOutline,
  mdiHome,
  mdiLogout,
  mdiShieldCrownOutline,
  mdiUpload,
} from '@mdi/js';

type Props = {
  onClose?: () => void;
};

const MyDrawerContents = ({ onClose }: Props) => {
  const user = useCurrentUser();

  const queryClient = useQueryClient();
  const logout = useMutation({
    mutationFn: () => API.delete('/auth/signout').then((res) => res.data),
    onSettled: () => queryClient.invalidateQueries(),
  });

  return (
    <Stack gap="0" className={css.MyDrawerContents}>
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

      <div style={{ flex: 1 }}></div>

      <Paper p="md">
        {user.data?.type === 'ADMIN' && (
          <RouteNavLink
            href="/admin"
            label="Admin panel"
            leftSection={<Icon path={mdiShieldCrownOutline} size="24px" />}
            description="Manage the site"
          />
        )}
        <RouteNavLink
          href={user.data ? '/account' : '/signin'}
          label={user.data ? user.data.email : 'My account'}
          description={user.data ? 'View your account' : 'Login'}
          onClick={onClose}
          leftSection={<Icon path={mdiAccountCircleOutline} size="24px" />}
        />
        {user.data && (
          <RouteNavLink
            href="/signin"
            label="Logout"
            onClick={() => {
              logout.mutate();
              onClose?.();
            }}
            leftSection={<Icon path={mdiLogout} size="24px" />}
            style={{ opacity: logout.isPending ? 0.5 : 1 }}
          />
        )}
      </Paper>
    </Stack>
  );
};

export default MyDrawerContents;
