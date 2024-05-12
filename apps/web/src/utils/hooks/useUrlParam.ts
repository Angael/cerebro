import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ViewMode } from '@/lib/browse-control/BrowseControlInputs';

type UrlParamKeys = 'pageNr' | 'viewMode' | 'itemCount';

type UrlParamValues = {
  pageNr: `${number}`;
  viewMode: ViewMode;
  itemCount: `${number}`;
};

const defaultValues: Record<UrlParamKeys, UrlParamValues[UrlParamKeys]> = {
  pageNr: '1',
  viewMode: 'dynamic-grid',
  itemCount: '25',
} as const;

export const useUrlParam = <T extends UrlParamKeys>(param: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = (searchParams.get(param) as UrlParamValues[typeof param]) || defaultValues[param];

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
    (value: UrlParamValues[typeof param]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(param, value);

      return params.toString();
    },
    [param, searchParams],
  );

  return [value, setParam, createQueryString] as const;
};
