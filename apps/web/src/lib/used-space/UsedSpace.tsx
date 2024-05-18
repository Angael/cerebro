'use client';
import React from 'react';
import numeral from 'numeral';
import { LoadingOverlay, Paper, Progress, Stack, Text } from '@mantine/core';
import { useUserLimits } from '@/utils/hooks/useUserLimits';

const UsedSpace = () => {
  const { data } = useUserLimits();

  const usageString =
    numeral(data?.used).format('0 b') + ' out of ' + numeral(data?.max).format('0 b');

  let value = data ? (100 * data.used) / data.max : 0;

  if (data) {
    if (data.max === 0) value = 100;
    if (data.max < data.used) value = 100;
  }

  let color = undefined;
  if (value > 70) color = 'yellow';
  if (value > 90) color = 'red';

  return (
    <Paper p="md" pos="relative">
      <Stack>
        <Text>Used space: {usageString}</Text>
        <Progress value={value} size="xl" color={color} />
      </Stack>
      <LoadingOverlay visible={!data} />
    </Paper>
  );
};

export default UsedSpace;
