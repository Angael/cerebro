import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ViewMode } from '@/lib/browse-control/BrowseControl';

type UrlParamKeys = 'pageNr' | 'viewMode' | 'itemCount';

type UrlParamValues = {
  pageNr: number;
  viewMode: ViewMode;
  itemCount: `${number}`;
};

export const useUrlParam = <T extends UrlParamKeys>(
  param: T,
  defaultValue?: UrlParamValues[typeof param],
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = (searchParams.get(param) as UrlParamValues[typeof param]) || defaultValue;

  const setParam = (newValue: UrlParamValues[typeof param] | null, replace = false) => {
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
