import { EndpointStatsResponse } from '@cerebro/server/src/routes/server-stats/server-stats.model';
import { BarChart } from '@mantine/charts';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';

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

  const dailyStatsArray = Object.entries(dailyStats).map(([date, stats]) => ({
    ...stats,
    date,
  }));

  return (
    <Paper p="md">
      <Title order={2} mb="md">
        {path}
      </Title>
      <Stack>
        <Group>
          <Stat name="Requests" value={requests} color="gray.1" />

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
          <Stat name="Avg" value={avgResponseTime} unit="ms" />
          <Stat name="Median" value={medianResponseTime} unit="ms" />
          <Stat name="90th" value={ninetyPercentile} unit="ms" />
          <Stat name="99th" value={ninetyNinePercentile} unit="ms" />
        </Group>
        <BarChart
          h={200}
          data={dailyStatsArray}
          dataKey="date"
          series={[
            { name: 'medianResponseTime', color: 'teal' },
            { name: 'ninetyPercentile', color: 'indigo' },
            { name: 'ninetyNinePercentile', color: 'grape' },
          ]}
          tickLine="y"
        />
      </Stack>
    </Paper>
  );
};

export default EndpointStats;
