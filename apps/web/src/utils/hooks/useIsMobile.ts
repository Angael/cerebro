import { useMediaQuery } from '@mantine/hooks';

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};
