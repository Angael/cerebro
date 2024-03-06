import { useAuth } from '@clerk/nextjs';

export const useAuthHeader = () => {
  const auth = useAuth();

  return async () =>
    ({
      Authorization: `Bearer ${await auth.getToken()}`,
    }) as const;
};
