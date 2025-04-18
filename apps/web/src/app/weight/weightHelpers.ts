import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { useQuery } from '@tanstack/react-query';
import { WeightData } from '@cerebro/server';

export function fillMissingDates(data: { date: string; weight_kg: number }[]) {
  if (!data || data.length === 0) {
    return [];
  }

  // Sort the data by date
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filledData: { date: string; weight_kg: number | null }[] = [];
  let currentDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);

  while (currentDate <= endDate) {
    const currentDateString = currentDate.toISOString().split('T')[0];
    const existingEntry = data.find((entry) => entry.date === currentDateString);

    if (existingEntry) {
      filledData.push({ date: existingEntry.date, weight_kg: existingEntry.weight_kg });
    } else {
      filledData.push({ date: currentDateString, weight_kg: null });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledData;
}

export const useUserWeight = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.userWeight],
    queryFn: () => API.get<WeightData[]>('/user/weight').then((res) => res.data),
    placeholderData: () => {
      return [];
    },
  });

  return query;
};
