'use client';
import React from 'react';
import numeral from 'numeral';
import { useQuery } from '@tanstack/react-query';
import { GetUploadLimits } from '@cerebro/shared';
import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { Paper, Progress, Stack, Text } from '@mantine/core';

type Props = {
  initialValue?: GetUploadLimits;
};

const UsedSpace = (props: Props) => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: [QUERY_KEYS.uploadLimits],
    queryFn: async () => API.get<GetUploadLimits>('/user/limits').then((res) => res.data),
    refetchOnWindowFocus: true,
    initialData: props.initialValue,
  });

  const usageString =
    numeral(data?.bytes.used).format('0 b') + ' out of ' + numeral(data?.bytes.max).format('0 b');

  const value = data ? (100 * data.bytes.used) / data.bytes.max : 0;
  return (
    <Paper p="md">
      <Stack>
        <Text>Used space: {usageString}</Text>
        <Progress value={value} size="xl" />
      </Stack>
    </Paper>
  );
};

export default UsedSpace;
