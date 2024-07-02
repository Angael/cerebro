'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@mdi/react';
import { mdiCrownOutline, mdiDeleteOutline, mdiLink } from '@mdi/js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { FrontItem, QueryItems } from '@cerebro/shared';
import { Button, Flex } from '@mantine/core';
import { useIsAdmin } from '@/utils/hooks/useIsAdmin';
import { notifications } from '@mantine/notifications';
import { parseErrorResponse } from '@/utils/parseErrorResponse';

type Props = {
  itemId: string;
  isMine?: boolean;
};

const ItemBar = ({ itemId, isMine }: Props) => {
  const isAdmin = useIsAdmin();
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
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Failed to delete',
        message: parseErrorResponse(e)?.general,
      });
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
    <Flex gap="sm" align="center" justify="flex-end" wrap="wrap">
      <Button
        variant="light"
        color="blue"
        onClick={onShare}
        rightSection={<Icon path={mdiLink} size={1} />}
      >
        {copied ? 'Copied!' : 'Share'}
      </Button>

      {(isMine || isAdmin) && (
        <Button
          variant="light"
          color="red"
          disabled={deleteMut.isPending}
          onClick={() => deleteMut.mutate()}
          rightSection={
            <Icon path={!isMine && isAdmin ? mdiCrownOutline : mdiDeleteOutline} size={1} />
          }
        >
          Delete
        </Button>
      )}
    </Flex>
  );
};

export default ItemBar;
