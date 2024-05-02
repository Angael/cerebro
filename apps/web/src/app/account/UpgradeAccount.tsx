'use client';
import React from 'react';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { Button, Paper, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { UserPlan_Endpoint } from '@cerebro/shared';

type Props = {};

const UpgradeAccount = (props: Props) => {
  const user = useCurrentUser();

  const subInfo = useQuery({
    enabled: !!user.data,
    queryKey: [QUERY_KEYS.accountPlan],
    queryFn: () => API.get<UserPlan_Endpoint>('/user/plan'),
  });

  return (
    <Paper p="md">
      <Title order={2}>Subscribtion</Title>
      <pre>{JSON.stringify(subInfo.data, null, 2)}</pre>
      <Button>Get beta access!</Button>
    </Paper>
  );
};

export default UpgradeAccount;
