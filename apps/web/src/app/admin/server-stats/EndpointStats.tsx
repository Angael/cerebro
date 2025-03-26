import { EndpointStatsResponse } from '@cerebro/server/src/routes/server-stats/server-stats.model';
import { BarChart } from '@mantine/charts';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useMemo } from 'react';

type Props = {
  path: string;
  stats: EndpointStatsResponse[string];
};

const colorPerMs = (ms: number) => {
  if (ms < 100) return 'green';
  if (ms < 200) return 'yellow';
  return 'red';
};

const Stat = ({
  name,
  value,
  color,
  unit,
}: {
  name: string;
  value: number;
  color?: any;
  unit?: string;
}) => (
  <Group gap="4px" wrap="nowrap" align="baseline">
    <Text size="sm">{name}:</Text>
    <Text span size="lg" c={color ?? colorPerMs(value)}>
      {Math.round(value)}
      {unit}
    </Text>{' '}
  </Group>
);

const countResponsesWithStatus = (
  statusCodes: EndpointStatsResponse[string]['dailyStats'][string]['statusCodes'],
) => {
  const counts = {
    responses2xx: 0,
    responses4xx: 0,
    responses5xx: 0,
  };

  for (const [code, count] of Object.entries(statusCodes)) {
    if (code.startsWith('2')) {
      counts.responses2xx += count;
    } else if (code.startsWith('4')) {
      counts.responses4xx += count;
    } else if (code.startsWith('5')) {
      counts.responses5xx += count;
    }
  }

  return counts;
};

const EndpointStats = ({ path, stats }: Props) => {
  const {
    requests,
    statusCodes,
    avgResponseTime,
    medianResponseTime,
    ninetyNinePercentile,
    ninetyPercentile,
    dailyStats,
  } = stats;

  const dailyStatsArray = useMemo(
    () =>
      Object.entries(dailyStats).map(([date, stats]) => {
        const { responses2xx, responses4xx, responses5xx } = countResponsesWithStatus(
          stats.statusCodes,
        );

        return {
          ...stats,
          date,
          responses2xx,
          responses4xx,
          responses5xx,
        };
      }),
    [dailyStats],
  );

  return (
    <Paper p="md">
      <Title order={2} mb="md">
        {path}
      </Title>
      <Stack>
        <Stat name="Requests" value={requests} color="gray.1" />
        <Group>
          {Object.entries(statusCodes).map(([code, count]) => (
            <Stat
              key={code}
              name={code}
              value={count}
              color={code.startsWith('2') ? 'green' : 'red'}
            />
          ))}
        </Group>
        <Group>
          <Stat name="Median" value={medianResponseTime} unit="ms" />
          <Stat name="Avg" value={avgResponseTime} unit="ms" />
          <Stat name="90th" value={ninetyPercentile} unit="ms" />
          <Stat name="99th" value={ninetyNinePercentile} unit="ms" />
        </Group>
        <BarChart
          h={150}
          data={dailyStatsArray}
          dataKey="date"
          series={[
            { name: 'medianResponseTime', color: 'grape.1' },
            { name: 'ninetyPercentile', color: 'grape.5' },
            { name: 'ninetyNinePercentile', color: 'grape.9' },
          ]}
          tickLine="y"
        />
        <BarChart
          h={150}
          data={dailyStatsArray}
          dataKey="date"
          series={[
            { name: 'responses2xx', color: 'green' },
            { name: 'responses4xx', color: 'orange' },
            { name: 'responses5xx', color: 'red' },
          ]}
          tickLine="y"
        />
      </Stack>
    </Paper>
  );
};

export default EndpointStats;
