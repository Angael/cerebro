import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ViewMode } from '@/lib/browse-control/BrowseControlInputs';
import { AuthorQuery } from '@cerebro/shared';

type UrlParamValues = {
  pageNr: `${number}`;
  viewMode: ViewMode;
  itemCount: `${number}`;
  author: AuthorQuery;
  storyId: string;
  chapterId: string | null;
  sceneId: string | null;
  dialogId: string | null;
};

type UrlParamKeys = keyof UrlParamValues;

const defaultValues: Record<UrlParamKeys, UrlParamValues[UrlParamKeys]> = {
  pageNr: '1',
  viewMode: 'dynamic-grid',
  itemCount: '40',
  author: 'all',
  storyId: '',
  chapterId: null,
  sceneId: null,
  dialogId: null,
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
      if (value) {
        params.set(param, value);
      } else {
        params.delete(param);
      }

      return params.toString();
    },
    [param, searchParams],
  );

  return [value, setParam, createQueryString] as const;
};
