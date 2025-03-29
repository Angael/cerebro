import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { GoalsType } from '@cerebro/server/src/routes/goals/goals.model';
import { Alert, Button, NumberInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications, showNotification } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function isNumberAndIsInRange(value: number | null, min: number, max: number) {
  if (value === null) return false;
  if (isNaN(value)) return false;
  if (value < min || value > max) return false;
  return true;
}

interface Props {
  goals: GoalsType | null;
}
const GoalsForm = ({ goals }: Props) => {
  const queryClient = useQueryClient();
  const saveGoals = useMutation({
    mutationFn: (values: Omit<GoalsType, 'date'>) => {
      const payload = {
        weight_kg: Number(values.weight_kg),
        kcal: Number(values.kcal),
        date: new Date().toISOString().split('T')[0],
      };
      return API.post('/goals/set', payload).then((res) => res.data);
    },
    onSuccess: () => {
      notifications.show({
        title: 'Goals',
        message: 'Goals saved successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.foodGoals] });
    },
    onError: (e) => {
      const parsedError = parseErrorResponse(e);
      console.log({ parsedError });
      showNotification({
        color: 'red',
        title: 'Error saving goals',
        message: parsedError?.general,
      });
    },
  });
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      weight_kg: goals?.weight_kg ?? null,
      kcal: goals?.kcal ?? null,
    },

    validate: {
      // weight_kg: (value) =>
      //   isNumberAndIsInRange(value, 30, 300) ? null : 'Weight must be a number between 30 and 300',
      // kcal: (value) =>
      //   isNumberAndIsInRange(value, 1000, 10000)
      //     ? null
      //     : 'Kcal must be a number between 1000 and 10000',
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => saveGoals.mutate(values))}>
      <Stack>
        <NumberInput
          label="Weight (kg)"
          key={form.key('weight_kg')}
          placeholder="50 kg"
          {...form.getInputProps('weight_kg')}
        />
        <NumberInput
          label="Kcal"
          placeholder="2000 kcal"
          key={form.key('kcal')}
          {...form.getInputProps('kcal')}
        />
        <Button type="submit" loading={saveGoals.isPending}>
          Save
        </Button>
      </Stack>
    </form>
  );
};

export default GoalsForm;
