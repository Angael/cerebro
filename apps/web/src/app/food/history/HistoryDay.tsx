import { Group, Paper, Text, Title } from '@mantine/core';
import { z } from 'zod';
import { zFoodHistory } from '../../../server/types/foodTypes';
import FoodLogEntry from '../food-log-entry/FoodLogEntry';
import FoodLogsList from '../food-log-entry/FoodLogsList';

type Props = {
  date: string;
  logs: z.infer<typeof zFoodHistory>;
};

const HistoryDay = ({ date, logs }: Props) => {
  const kcalSum = logs.reduce((acc, log) => acc + log.kcal, 0);

  return (
    <Paper p="md" component="article">
      <Group component="header">
        <Title order={3}>{date}</Title>
        <Text c="dark.2">{kcalSum} kcal</Text>
      </Group>

      <FoodLogsList>
        {logs.map((log) => (
          <FoodLogEntry key={log.id} food={log} />
        ))}
      </FoodLogsList>
    </Paper>
  );
};

export default HistoryDay;
