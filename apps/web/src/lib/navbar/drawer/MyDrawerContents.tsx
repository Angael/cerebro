import { RouteNavLink } from '@/lib/route-nav-link/RouteNavLink';
import { API } from '@/utils/API';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { Flex, Stack, Title } from '@mantine/core';
import {
  mdiAccountCircleOutline,
  mdiCounter,
  mdiFoodApple,
  mdiHome,
  mdiLogout,
  mdiScale,
  mdiShieldCrownOutline,
  mdiUpload,
} from '@mdi/js';
import { Icon } from '@mdi/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import css from './MyDrawerContents.module.scss';

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
    <Stack component="nav" className={css.MyDrawerContents} gap="lg" w="340px">
      <Stack gap="0">
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
      </Stack>

      <Stack gap="0">
        <Title order={4} mb="sm">
          Fitness
        </Title>
        <RouteNavLink
          href="/food"
          label="Food"
          description="Log what you ate"
          onClick={onClose}
          leftSection={<Icon path={mdiFoodApple} size="24px" />}
        />
        <RouteNavLink
          disabled
          href="/weight"
          label="Weight"
          description="Update your weight"
          onClick={onClose}
          leftSection={<Icon path={mdiScale} size="24px" />}
        />
        <RouteNavLink
          href="/goals"
          label="Goals"
          description="Change target weight or calories"
          onClick={onClose}
          leftSection={<Icon path={mdiCounter} size="24px" />}
        />
      </Stack>

      <Stack gap="0">
        <Title order={4} mb="sm">
          User
        </Title>
        {user.data?.type === 'ADMIN' && (
          <RouteNavLink
            href="/admin"
            label="Admin panel"
            leftSection={<Icon path={mdiShieldCrownOutline} size="24px" />}
            onClick={onClose}
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
      </Stack>
    </Stack>
  );
};

export default MyDrawerContents;
