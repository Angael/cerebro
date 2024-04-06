'use client';
import React from 'react';
import Pagination from '@/lib/pagination/Pagination';
import ItemGrid from '@/lib/item-grid/ItemGrid';
import { useQuery } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { QueryItems } from '@cerebro/shared';
import { QUERY_KEYS } from '@/utils/consts';
import { useSearchParams } from 'next/navigation';

const Browse = () => {
  const searchParams = useSearchParams();
  const pageNr = parseInt(searchParams.get('pageNr') || '1', 10);

  const { data, isFetched } = useQuery({
    queryKey: [QUERY_KEYS.items, { limit: 10, page: pageNr - 1 }],
    queryFn: () =>
      API.get<QueryItems>('/items', {
        params: { limit: 10, page: pageNr - 1 },
      }).then((res) => res.data),
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  const { items, count } = data;
  const pageCount = Math.ceil(count / 10);

  return (
    <>
      <Pagination page={pageNr} pageCount={pageCount} />
      {items?.length > 0 && <ItemGrid items={items} key={pageNr} />}
      <Pagination page={pageNr} pageCount={pageCount} />
    </>
  );
};

export default Browse;
