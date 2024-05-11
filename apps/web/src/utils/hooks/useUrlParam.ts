import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useUrlParam = (param: string, defaultValue?: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(param) || defaultValue;

  const setParam = (newValue: string | number | null, replace = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set(param, String(newValue));
    } else {
      params.delete(param);
    }

    const query = params.toString();
    const url = `${pathname}${query ? `?${query}` : ''}`;
    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return [value, setParam, createQueryString] as const;
};
