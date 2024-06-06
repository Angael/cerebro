import { useMediaQuery } from '@mantine/hooks';

// Px value has to be same as _utils.scss
export const useShowDrawer = () => {
  return useMediaQuery('(min-width: 1280px)') ?? false;
};
