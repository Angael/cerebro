'use client';

import React from 'react';
import { Btn } from '@/styled/btn/Btn';
import { useRouter } from 'next/navigation';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { FrontItem, QueryItems } from '@cerebro/shared';

type Props = {
  itemId: string;
  isMine?: boolean;
};

const ItemBar = ({ itemId, isMine }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMut = useMutation({
    mutationFn: () => API.delete(`/items/item/${itemId}`),
    onSuccess: async () => {
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.items] },
        (old: QueryItems | undefined) => {
          if (!old) return;
          return {
            ...old,
            items: old.items.filter((item: FrontItem) => item.id !== Number(itemId)),
          };
        },
      );

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.items],
      });
      router.push('/browse');
    },
  });

  return (
    <div className="flex gap-1 wrap">
      <Link
        href="/browse"
        onClick={router.back}
        className="flex center"
        style={{ marginRight: 'auto' }}
      >
        <Icon path={mdiArrowLeft} size={0.8} />
        Go back
      </Link>
      <Btn>Download</Btn>
      <Btn>Share</Btn>
      {isMine && (
        <Btn disabled={deleteMut.isPending} onClick={() => deleteMut.mutate()}>
          Delete
        </Btn>
      )}
    </div>
  );
};

export default ItemBar;
