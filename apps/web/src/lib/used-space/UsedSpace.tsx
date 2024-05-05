'use client';
import React from 'react';
import numeral from 'numeral';
import { LoadingOverlay, Paper, Progress, Stack, Text } from '@mantine/core';
import { useUserLimits } from '@/utils/hooks/useUserLimits';

const UsedSpace = () => {
  const { data } = useUserLimits();

  const usageString =
    numeral(data?.bytes.used).format('0 b') + ' out of ' + numeral(data?.bytes.max).format('0 b');

  const value = data ? (100 * data.bytes.used) / data.bytes.max : 0;
  return (
    <Paper p="md" pos="relative">
      <Stack>
        <Text>Used space: {usageString}</Text>
        <Progress value={value} size="xl" />
      </Stack>
      <LoadingOverlay visible={!data} />
    </Paper>
  );
};

export default UsedSpace;
