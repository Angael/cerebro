import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useRequireAccount = () => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    console.log('user', user);
    if (user.isSuccess && !user.data) {
      router.push('/signin');
    }
  }, [user.isSuccess, user.data]);
};
