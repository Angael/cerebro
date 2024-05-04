'use client';
import React from 'react';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { Button, Group, LoadingOverlay, Paper, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { UserPlan_Endpoint } from '@cerebro/shared';
import SimpleError from '@/lib/simple-error/SimpleError';

type Props = {};

const UpgradeAccount = (props: Props) => {
  const user = useCurrentUser();

  const subInfo = useQuery({
    enabled: !!user.data,
    queryKey: [QUERY_KEYS.accountPlan],
    queryFn: () => API.get<UserPlan_Endpoint>('/user/plan').then((r) => r.data),
  });

  const hasPlan = !!subInfo.data?.activePlan;

  const onSubscribe = async () => {
    const response = await API.post('/user/subscribe');

    location.href = response.data.url;
  };

  const onGoToBilling = async () => {
    const response = await API.get('/user/billing');
    location.href = response.data.url;
  };

  if (subInfo.isError) {
    return (
      <Paper p="md" pos="relative">
        <SimpleError error={subInfo.error} />
      </Paper>
    );
  }

  return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={!subInfo.isFetched || subInfo.isFetching} />
      {hasPlan ? (
        <>
          <Title order={2}>Current plan</Title>
          <pre>{JSON.stringify(subInfo.data, null, 2)}</pre>
          <Group gap="md">
            <Button onClick={onGoToBilling}>Go to billing portal</Button>
          </Group>
        </>
      ) : (
        <Group gap="md">
          <Title order={2}>Subscription</Title>
          <Button onClick={onSubscribe}>Get access!</Button>
        </Group>
      )}
    </Paper>
  );
};

export default UpgradeAccount;
