import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useFoodGoals } from '@/utils/hooks/useFoodGoals';
import { AreaChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { useMemo, useState } from 'react';
import { fillMissingDates, useUserWeight } from './weightHelpers';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { Button, Group, Paper, Stack, Text } from '@mantine/core';
import WeightDialog from './WeightDialog';

type Props = {};

// Gets nearest 5s above and below the min and max values
const getDomain = (min: number, max: number) => {
  const diff = max - min;

  const step = Math.ceil(diff / 5);
  const lowerBound = Math.floor(min / step) * step;
  const upperBound = Math.ceil(max / step) * step;

  return [lowerBound, upperBound];
};

const Weight = (props: Props) => {
  const user = useCurrentUser();
  const goals = useFoodGoals(user);
  const weight_kg = goals.data?.weight_kg ?? null;

  const [open, setOpen] = useState(false);
  const userWeightQuery = useUserWeight(user);

  const latestWeight = useMemo(() => {
    if (!userWeightQuery.data) return null;
    const latest = userWeightQuery.data[userWeightQuery.data.length - 1];
    return latest?.weight_kg ?? null;
  }, [userWeightQuery.data]);

  const domain = useMemo(() => {
    const weights = userWeightQuery.data ? [...userWeightQuery.data.map((d) => d.weight_kg)] : [];
    if (goals.data?.weight_kg) {
      weights.push(goals.data.weight_kg);
    }

    return getDomain(Math.min(...weights) - 1, Math.max(...weights) + 1);
  }, [userWeightQuery.data, goals.data]);

  const datesWithFilledDates = useMemo(() => {
    if (!userWeightQuery.data) return [];
    const filledData = fillMissingDates(userWeightQuery.data);
    return filledData.map((d) => ({ ...d, date: new Date(d.date).toLocaleDateString() }));
  }, [userWeightQuery.data]);

  const isMobile = useIsMobile();

  return (
    <div>
      <AreaChart
        curveType="monotone"
        h={200}
        data={datesWithFilledDates}
        dataKey="date"
        series={[{ name: 'weight_kg', color: 'grape.5' }]}
        referenceLines={
          weight_kg ? [{ y: weight_kg, label: 'Weight goal', color: 'red.6' }] : undefined
        }
        yAxisProps={{ domain, tickCount: 6 }}
        xAxisProps={{ interval: 30 }}
        tickLine="y"
        withPointLabels
        connectNulls
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
        {userWeightQuery.data?.map((d) => (
          <Paper key={d.date} p="sm">
            <Group>
              <Text c="gray.6" size="sm">
                {d.date}
              </Text>
              <Text c="cyan">{d.weight_kg}kg</Text>
              {weight_kg && (
                <Text c="gray.6" size="sm">
                  (To goal: {Math.abs(weight_kg - d.weight_kg)} kg)
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
