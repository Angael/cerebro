import { QueryFoodHistory } from '@cerebro/server/src/routes/food/food.model';
import css from './HistoryDay.module.css';
import { Paper, Stack, Title, Group, Text } from '@mantine/core';

type Props = {
  date: string;
  logs: QueryFoodHistory;
};

const HistoryDay = ({ date, logs }: Props) => {
  const kcalSum = logs.reduce((acc, log) => acc + log.kcal, 0);

  return (
    <Paper p="md">
      <Group>
        <Title order={3}>{date}</Title>
        <Text c="dark.2">{kcalSum} kcal</Text>
      </Group>

      <Stack>
        {logs.map((log) => (
          <Group key={log.id} align="flex-start" justify="space-between">
            <Stack component="header" gap={0} flex={3}>
              <Text fw="normal">{log.product_name}</Text>
              <Text>{log.brands}</Text>
            </Stack>
            <Stack align="flex-end" gap={0} flex={1}>
              <Text>{log.amount}g</Text>
              <Text>{log.kcal} kcal</Text>
            </Stack>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
};

export default HistoryDay;
