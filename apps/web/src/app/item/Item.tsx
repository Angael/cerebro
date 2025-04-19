'use client';
import React, { memo } from 'react';
import { FrontItem, QueryItems } from '@cerebro/shared';
import ImageItem from '@/app/item/ImageItem';
import VideoItem from '@/app/item/VideoItem';
import ItemBar from '@/app/item/ItemBar';
import { useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';

const Item = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const itemId = searchParams.get('itemId')!;

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.item, itemId],
    queryFn: () => API.get<FrontItem>(`/items/item/${itemId}`).then((res) => res.data),
    initialData: () => {
      let cachedItem: any;
      queryClient
        .getQueriesData<QueryItems>({ queryKey: [QUERY_KEYS.items] })
        .forEach(([_queryKey, queryData]) => {
          if (queryData?.items) {
            cachedItem = queryData.items.find((d: FrontItem) => d.id === Number(itemId));
          }
        });

      return cachedItem;
    },
  });

  return (
    <>
      {data?.type === 'IMAGE' && <ImageItem item={data} />}
      {data?.type === 'VIDEO' && <VideoItem item={data} />}
      <ItemBar itemId={itemId} isMine={data?.isMine} />
    </>
  );
};

export default Item;
