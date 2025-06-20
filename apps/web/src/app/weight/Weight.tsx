'use client';
import { UserSession } from '@/server/auth/getUser';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { GoalsType, WeightData } from '@cerebro/server';
import { AreaChart, LineChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import WeightDialog from './WeightDialog';
import { formatYYYYMMDD } from '@/utils/formatYYYYMMDD';

export type Props = {
  user: UserSession;
  weight: WeightData[];
  goals: GoalsType | undefined;
};

// Gets nearest 5s above and below the min and max values
const getDomain = (min: number, max: number) => {
  const diff = max - min;

  const step = Math.ceil(diff / 5);
  const lowerBound = Math.floor(min / step) * step;
  const upperBound = Math.ceil(max / step) * step;

  return [lowerBound, upperBound];
};

const Weight = ({ user, weight, goals }: Props) => {
  const weight_kg = goals?.weight_kg ?? null;

  const [open, setOpen] = useState(false);

  const latestWeight = useMemo(() => {
    if (!weight) return null;
    const latest = weight[weight.length - 1];
    return latest?.weight_kg ?? null;
  }, [weight]);

  const domain = useMemo(() => {
    const weights = weight ? [...weight.map((d) => d.weight_kg)] : [];
    if (goals?.weight_kg) {
      weights.push(goals.weight_kg);
    }

    return getDomain(Math.min(...weights) - 1, Math.max(...weights) + 1);
  }, [weight, goals]);

  const weightWithTimeDates = useMemo(() => {
    if (!weight) return [];
    return weight.map((d) => ({ ...d, date: new Date(d.date).getTime() }));
  }, [weight]);

  const isMobile = useIsMobile();

  // TODO write better logic for domain
  const xDomain = [
    weightWithTimeDates[0].date,
    weightWithTimeDates[weightWithTimeDates.length - 1].date,
  ];

  return (
    <div>
      <LineChart
        curveType="monotone"
        h={200}
        data={weightWithTimeDates}
        dataKey="date"
        series={[{ name: 'weight_kg', color: 'grape.5' }]}
        referenceLines={
          weight_kg ? [{ y: weight_kg, label: 'Weight goal', color: 'red.6' }] : undefined
        }
        yAxisProps={{ domain, tickFormatter: (value) => `${value} kg` }}
        xAxisProps={{
          type: 'number',
          domain: xDomain,
          scale: 'time',
          tickFormatter: (timestamp) => new Date(timestamp).toLocaleDateString(),
          allowDuplicatedCategory: false,
        }}
        tooltipProps={{
          labelFormatter: (timestamp) => {
            return formatYYYYMMDD(new Date(timestamp));
          },
          formatter: (value) => `${value} kg`,
        }}
        tickLine="y"
        withPointLabels
        withXAxis={isMobile ? false : true}
        withYAxis={isMobile ? false : true}
      />

      <Button
        onClick={() => setOpen(true)}
        mt="md"
        size="xs"
        variant="outline"
        color="cyan"
        style={{ marginLeft: 'auto', display: 'block' }}
      >
        Add weight
      </Button>

      <Stack mt="md">
        {weight?.map((d) => (
          <Paper key={d.date} p="sm">
            <Group>
              <Text c="gray.6" size="sm">
                {d.date}
              </Text>
              <Text c="cyan">{d.weight_kg}kg</Text>
              {weight_kg && (
                <Text c="gray.6" size="sm">
                  (To goal: {Math.round(Math.abs(weight_kg - d.weight_kg) * 10) / 10} kg)
                </Text>
              )}
            </Group>
          </Paper>
        ))}
      </Stack>

      <WeightDialog open={open} onClose={() => setOpen(false)} lastWeight={latestWeight} />
    </div>
  );
};

export default Weight;
