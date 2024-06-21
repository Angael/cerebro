import React from 'react';
import { Paper, Stack } from '@mantine/core';
import css from './MyDrawerContents.module.scss';
import { RouteNavLink } from '@/lib/route-nav-link/RouteNavLink';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';

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
    <Paper p="md" className={css.MyDrawerContents}>
      <Stack gap="0" h="100%">
        <RouteNavLink href="/browse" label="Browse" onClick={onClose} />
        {user.data && <RouteNavLink href="/upload" label="Upload" onClick={onClose} />}

        <div style={{ flex: 1 }}></div>

        {user.data && <RouteNavLink href="/account" label="My account" onClick={onClose} />}
        {user.data ? (
          <RouteNavLink
            href="/signin"
            label="Logout"
            onClick={() => {
              logout.mutate();
              onClose?.();
            }}
            style={{ opacity: logout.isPending ? 0.5 : 1 }}
          />
        ) : (
          <RouteNavLink href="/signin" label="Login" onClick={onClose} />
        )}
        {user.data?.type === 'ADMIN' && <RouteNavLink href="/admin" label="Admin panel" />}
      </Stack>
    </Paper>
  );
};

export default MyDrawerContents;
