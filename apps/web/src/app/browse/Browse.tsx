'use client';
import React, { memo, useEffect } from 'react';
import Pagination from '@/lib/pagination/Pagination';
import ItemGrid from '@/lib/item-grid/ItemGrid';
import { useQuery } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { QueryItems } from '@cerebro/shared';
import { QUERY_KEYS } from '@/utils/consts';
import PageLoader from '@/lib/page-loader/PageLoader';
import SimpleError from '@/lib/simple-error/SimpleError';
import BrowseControl from '@/lib/browse-control/BrowseControl';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import { Group } from '@mantine/core';
import BrowseNav from '@/app/browse/BrowseNav';

const Browse = () => {
  const [pageNrStr, setPageNrStr, createPageNrQueryString] = useUrlParam('pageNr');
  const pageNr = parseInt(pageNrStr, 10);
  const limit = parseInt(useUrlParam('itemCount')[0], 10);
  const [author] = useUrlParam('author');

  const { data, isFetched, isPending, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.items, { limit, page: pageNr - 1, author }],
    queryFn: () =>
      API.get<QueryItems>('/items', { params: { limit, page: pageNr - 1, author } }).then(
        (res) => res.data,
      ),
    placeholderData: (previousData) => previousData,
  });

  const pageCount = Math.ceil((data?.count ?? 0) / limit);

  // Reset page number if it's too high
  useEffect(() => {
    if (pageNr > pageCount) {
      const newPageNr = Math.max(1, pageCount) || 1;
      setPageNrStr(`${newPageNr}`);
    }
  }, [pageNr, pageCount]);

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    return <SimpleError error={error} />;
  }

  const { items } = data;

  return (
    <>
      <BrowseNav />
      <Group justify="space-between">
        <Pagination
          page={pageNr}
          createQueryString={createPageNrQueryString}
          pageCount={pageCount}
        />
        <BrowseControl />
      </Group>

      {items?.length > 0 && <ItemGrid items={items} isLoading={!isFetched} />}

      <Group justify="space-between">
        <Pagination
          page={pageNr}
          createQueryString={createPageNrQueryString}
          pageCount={pageCount}
        />
        <BrowseControl />
      </Group>
    </>
  );
};

export default memo(Browse);
