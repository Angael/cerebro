import { API } from '@/utils/API';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { FoodProduct } from '@cerebro/db';
import { NewProduct } from '@cerebro/server';
import { Button, Modal, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface Props {
  code: string | null;
  name: string | null;
  open: boolean;
  onClose: () => void;
  onCreated: (foodProduct: FoodProduct) => void;
}

const CreateProductDialog = ({ code, name: initName, open, onClose, onCreated }: Props) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [size, setSize] = useState('');

  const createMutation = useMutation({
    mutationFn: () => {
      const body: NewProduct = { code, name, kcal: Number(kcal), size: Number(size) };
      return API.post('/food/product', body);
    },
    onSuccess: (result) => {
      onCreated(result.data);
    },
  });

  useEffect(() => {
    if (open) {
      setName(initName || '');
    }
  }, [open]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <Modal opened={open} onClose={onClose} fullScreen={isMobile} size="xl" title="New product">
      <form onSubmit={onSubmit}>
        <Stack>
          {code && (
            <Text size="sm" c="gray.6" mb={-8}>
              Code: {code}
            </Text>
          )}
          <TextInput
            required
            data-autofocus
            size="md"
            label="Product name"
            placeholder="Banana"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <NumberInput
            required
            size="md"
            label="kcal / 100g"
            placeholder="100"
            value={kcal}
            onChange={(number) => setKcal(String(number))}
          />
          <NumberInput
            size="md"
            label="Package size (g)"
            placeholder="100"
            value={size}
            onChange={(number) => setSize(String(number))}
          />
          <Button
            type="submit"
            loading={createMutation.isPending}
            style={{ margin: 'auto', marginTop: '32px' }}
          >
            Create new product
          </Button>
        </Stack>{' '}
      </form>
    </Modal>
  );
};

export default CreateProductDialog;
