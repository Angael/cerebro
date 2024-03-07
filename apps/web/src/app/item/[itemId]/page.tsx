import React from 'react';
import { ApiServer, getApiHeaders } from '@/utils/api.server';
import { auth } from '@clerk/nextjs';
import { FrontItem } from '@cerebro/shared';
import ImageItem from '@/app/item/[itemId]/ImageItem';
import VideoItem from '@/app/item/[itemId]/VideoItem';
import GoBackLink from '@/app/item/[itemId]/GoBackLink';

type Props = {
  params: {
    itemId: string;
  };
};

const ItemPage = async ({ params }: Props) => {
  const clerkToken = auth();

  const { data } = await ApiServer.get<FrontItem>(`/items/item/${params.itemId}`, {
    headers: await getApiHeaders(clerkToken),
  });

  const { type } = data;

  return (
    <>
      <GoBackLink />
      {type === 'IMAGE' && <ImageItem item={data} />}
      {type === 'VIDEO' && <VideoItem item={data} />}
    </>
  );
};

export default ItemPage;
