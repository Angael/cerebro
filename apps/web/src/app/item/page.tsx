'use client';
import React from 'react';
import { FrontItem } from '@cerebro/shared';
import ImageItem from '@/app/item/ImageItem';
import VideoItem from '@/app/item/VideoItem';
import ItemBar from '@/app/item/ItemBar';
import { useSearchParams } from 'next/navigation';
import { API } from '@/utils/API';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';

const ItemPage = () => {
  const searchParams = useSearchParams();
  const itemId = searchParams.get('itemId')!;

  const { data } = useQuery({
    queryKey: [QUERY_KEYS.item, itemId],
    queryFn: () => API.get<FrontItem>(`/items/item/${itemId}`).then((res) => res.data),
  });

  return (
    <>
      <ItemBar itemId={itemId} isMine={data?.isMine} />
      {data?.type === 'IMAGE' && <ImageItem item={data} />}
      {data?.type === 'VIDEO' && <VideoItem item={data} />}
    </>
  );
};

export default ItemPage;
