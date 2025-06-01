'use client';
import UsedSpace from '@/lib/used-space/UsedSpace';
import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { useUserLimits } from '@/utils/hooks/useUserLimits';
import { isUrl } from '@/utils/isUrl';
import { Button, Text, TextInput } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import css from './ImportFromLink.module.scss';
import StatsFromLink from './StatsFromLink';

const Page = () => {
  const [link, setLink] = useState('');
  const isValidUrl = isUrl(link);

  const { data } = useUserLimits();
  const disableUpload = data ? data?.used >= data?.max : true;

  const mutation = useMutation({
    meta: { invalidateQueryKey: [QUERY_KEYS.uploadLimits] },
    mutationFn: () => API.post('/items/upload/file-from-link', { link }),
  });

  const {
    data: videoStats,
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    enabled: isValidUrl && !disableUpload,
    queryKey: ['statsFromLink', link],
    queryFn: () =>
      API.get<any>('/items/upload/file-from-link', {
        params: { link },
      }).then((res) => res.data),
  });

  const disabled = !isValidUrl || mutation.isPending || !isFetched || disableUpload;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    mutation.mutate();
  };

  return (
    <form onSubmit={onSubmit} className={css.stack}>
      <UsedSpace />
      <TextInput
        label="Import from link"
        name="video-link"
        type="url"
        placeholder="https://example.com/watcg?v=123"
        value={link}
        onChange={(e) => setLink(e.currentTarget.value)}
        disabled={disableUpload}
      />

      <StatsFromLink stats={videoStats} isFetching={isFetching} isError={isValidUrl && isError} />
      <Button disabled={disabled} type="submit" style={{ alignSelf: 'flex-start' }}>
        Download from link
      </Button>

      {!mutation.isPending && mutation.isError && <Text c="red.8">Error!</Text>}
      {!mutation.isPending && mutation.isSuccess && <Text c="green.8">Success!</Text>}
    </form>
  );
};

export default Page;
