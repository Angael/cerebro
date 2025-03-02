import { API } from '@/utils/API';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { QueryFoodHistory } from '@cerebro/server/src/routes/food/food.model';
import { Button, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import HistoryDay from './HistoryDay';
import { QUERY_KEYS } from '@/utils/consts';

type Props = {};

const History = (props: Props) => {
  const user = useCurrentUser();
  const foodHistory = useQuery({
    enabled: !!user.data,
    queryKey: [QUERY_KEYS.foodHistory],
    queryFn: () => API.get<QueryFoodHistory>('/food/history').then((r) => r.data),
  });

  const groupedFoods = foodHistory.data?.reduceRight(
    (acc, food) => {
      const date = format(new Date(food.dayDate), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(food);

      return acc;
    },
    {} as Record<string, QueryFoodHistory>,
  );

  return (
    <Stack>
      <Title order={2}>Previous logs</Title>

      {Object.entries(groupedFoods ?? {}).map(([date, logs]) => (
        <HistoryDay key={date} date={date} logs={logs} />
      ))}

      <Button disabled style={{ alignSelf: 'flex-end' }}>
        View all
      </Button>
    </Stack>
  );
};

export default History;
