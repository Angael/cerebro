import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useSetUrlParams = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (params: Record<string, string | number | boolean | null>, replace = false) => {
    const newParams = new URLSearchParams(searchParams.toString());

    for (const key in params) {
      if (params[key] === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(params[key]));
      }
    }

    const query = newParams.toString();
    const url = `${pathname}${query ? `?${query}` : ''}`;

    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };
};
