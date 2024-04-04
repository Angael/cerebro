'use client';
import React from 'react';
import Pagination from '@/lib/pagination/Pagination';
import ItemGrid from '@/lib/item-grid/ItemGrid';
import { useQuery } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { QueryItems } from '@cerebro/shared';
import { QUERY_KEYS } from '@/utils/consts';

type Props = {
  searchParams: { page?: string };
};

const BrowsePage = ({ searchParams: { page } }: Props) => {
  const pageNr = parseInt(page ?? '1');
  const { data, isFetched } = useQuery({
    queryKey: [QUERY_KEYS.items, { limit: 10, page: pageNr - 1 }],
    queryFn: () =>
      API.get<QueryItems>('/items', {
        params: { limit: 10, page: pageNr - 1 },
      }).then((res) => res.data),
  });

  if (!data) {
    // TODO: Better skeleton
    return <div>Loading...</div>;
  }

  const { items, count } = data;
  const pageCount = Math.ceil(count / 10);

  return (
    <>
      <Pagination page={pageNr} pageCount={pageCount} />
      {items?.length > 0 && <ItemGrid items={items} key={page} />}
      <Pagination page={pageNr} pageCount={pageCount} />
    </>
  );
};

export default BrowsePage;
