'use client';
import adminGuardedPage from '@/lib/admin/adminGuardedPage';
import PageLoader from '@/lib/page-loader/PageLoader';
import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { EndpointStatsResponse } from '@cerebro/server/src/routes/server-stats/server-stats.model';
import '@mantine/charts/styles.css';
import { Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import EndpointStats from './EndpointStats';

const AdminServerStatsPage = () => {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.adminServerStats],
    queryFn: () => API.get<EndpointStatsResponse>(`/stats`).then((res) => res.data),
  });

  if (!data) {
    return <PageLoader />;
  }

  const endpointsSortedByRequests = Object.entries(data).sort(
    ([, a], [, b]) => b.requests - a.requests,
  );

  return (
    <Stack gap="md">
      <Title order={1} mb="md">
        Server Stats:
      </Title>

      {endpointsSortedByRequests.map(([endpoint, stats]) => (
        <EndpointStats key={endpoint} path={endpoint} stats={stats} />
      ))}
    </Stack>
  );
};

export default adminGuardedPage(AdminServerStatsPage);
