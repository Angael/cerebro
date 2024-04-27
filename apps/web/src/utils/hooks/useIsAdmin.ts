import { useCurrentUser } from '@/utils/hooks/useCurrentUser';

export const useIsAdmin = () => {
  const user = useCurrentUser();

  return user.data?.type === 'ADMIN';
};
