import { postNewFoodProduct } from '@/server/postNewFoodProduct';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { FoodProduct } from '@cerebro/db';
import { Button, Modal, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

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
    mutationFn: () => postNewFoodProduct({ code, name, kcal: Number(kcal), size: Number(size) }),
    onSuccess: (result) => {
      onCreated(result);
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Failed create product',
        message: 'The product could not be created. Please try again.',
      });
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
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateProductDialog;
