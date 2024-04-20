'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiDeleteOutline, mdiShare } from '@mdi/js';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { FrontItem, QueryItems } from '@cerebro/shared';
import { Button } from '@mantine/core';

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

  const [copied, setCopied] = useState(false);
  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
    } catch (e) {
      setCopied(false);
      console.error('Failed to copy to clipboard', e);
    }
  };

  return (
    <div className="flex gap-1 wrap">
      <Link
        href="/browse"
        onClick={router.back}
        className="flex center"
        style={{ marginRight: 'auto' }}
      >
        <Icon path={mdiArrowLeft} size={0.8} />
        Back
      </Link>
      <Button
        variant="light"
        color="blue"
        onClick={onShare}
        rightSection={<Icon path={mdiShare} size={1} />}
      >
        {copied ? 'Copied!' : 'Share'}
      </Button>
      {isMine && (
        <Button
          variant="light"
          color="red"
          disabled={deleteMut.isPending}
          onClick={() => deleteMut.mutate()}
          rightSection={<Icon path={mdiDeleteOutline} size={1} />}
        >
          Delete
        </Button>
      )}
    </div>
  );
};

export default ItemBar;
