'use client';
import React, { memo } from 'react';
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

const Browse = () => {
  const pageNr = parseInt(useUrlParam('pageNr')[0], 10);
  const limit = parseInt(useUrlParam('itemCount')[0], 10);

  const { data, isFetched, isPending, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.items, { limit, page: pageNr - 1 }],
    queryFn: () =>
      API.get<QueryItems>('/items', { params: { limit, page: pageNr - 1 } }).then(
        (res) => res.data,
      ),
    placeholderData: (previousData) => previousData,
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (isError) {
    return <SimpleError error={error} />;
  }

  const { items, count } = data;
  const pageCount = Math.ceil(count / limit);

  return (
    <>
      <BrowseControl />
      <Pagination page={pageNr} pageCount={pageCount} />
      {items?.length > 0 && <ItemGrid items={items} isLoading={!isFetched} />}
      <Pagination page={pageNr} pageCount={pageCount} />
    </>
  );
};

export default memo(Browse);
