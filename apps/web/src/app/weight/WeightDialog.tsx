import { API } from '@/utils/API';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { WeightData } from '@cerebro/server';
import '@mantine/charts/styles.css';
import { Button, Modal, NumberInput, Stack } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  lastWeight?: number | null;
}

const WeightDialog = ({ open, onClose, lastWeight }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [weight, setWeight] = useState(String(lastWeight || ''));

  const saveMutation = useMutation({
    mutationFn: () => {
      const body: WeightData = {
        date: new Date().toISOString().split('T')[0],
        weight_kg: Number(weight),
      };
      return API.post('/user/weight', body);
    },
    onSuccess: () => {
      router.refresh();
      onClose();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <Modal opened={open} onClose={onClose} fullScreen={isMobile} size="xl" title="New product">
      <form onSubmit={onSubmit}>
        <Stack>
          <NumberInput
            required
            size="md"
            label="Weight (kg)"
            placeholder="60"
            value={weight}
            onChange={(number) => setWeight(String(number))}
          />
          <Button
            type="submit"
            loading={saveMutation.isPending}
            style={{ margin: 'auto', marginTop: '32px' }}
          >
            Save weight
          </Button>
        </Stack>{' '}
      </form>
    </Modal>
  );
};

export default WeightDialog;
