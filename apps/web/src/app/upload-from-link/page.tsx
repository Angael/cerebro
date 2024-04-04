'use client';
import React, { useState } from 'react';
import Textfield from '@/styled/textfield/Textfield';
import { Btn } from '@/styled/btn/Btn';
import css from './ImportFromLink.module.scss';
import { useMutation, useQuery } from '@tanstack/react-query';
import StatsFromLink from './StatsFromLink';
import { isUrl } from '@/utils/isUrl';
import UsedSpace from '@/app/upload/used-space/UsedSpace';
import { useInvalidateQueries } from '@/utils/useInvalidateQueries';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';

const Page = () => {
  const invalidateQueries = useInvalidateQueries();
  const [link, setLink] = useState('');
  const isValidUrl = isUrl(link);

  const mutation = useMutation({
    mutationFn: () => API.post('/items/upload/file-from-link', { link }),
    onSettled: async () => {
      await invalidateQueries({ queryKey: [QUERY_KEYS.uploadLimits] });
    },
  });

  const {
    data: videoStats,
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    enabled: isValidUrl,
    queryKey: ['statsFromLink', link],
    queryFn: () =>
      API.get<any>('/items/upload/file-from-link', {
        params: { link },
      }).then((res) => res.data),
    retry: false,
  });

  const disabled = !isValidUrl || mutation.isPending || !isFetched;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={onSubmit} className={css.stack}>
      <UsedSpace />
      <Textfield
        label="Import from link"
        input={{
          value: link,
          onChange: (e) => setLink(e.currentTarget.value),
          placeholder: 'https://example.com/watcg?v=123',
          type: 'url',
          name: 'video-link',
        }}
      />

      <StatsFromLink stats={videoStats} isFetching={isFetching} isError={isValidUrl && isError} />
      <Btn disabled={disabled} type="submit" style={{ alignSelf: 'flex-start' }}>
        Download from link
      </Btn>

      {!mutation.isPending && mutation.isError && <p className="error">Error!</p>}
      {!mutation.isPending && mutation.isSuccess && <p className="success">Success!</p>}
    </form>
  );
};

export default Page;
