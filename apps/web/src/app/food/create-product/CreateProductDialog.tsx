import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { Button, Modal, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';

interface Props {
  code: string | null;
  name: string | null;
  open: boolean;
  onClose: () => void;
}

const CreateProductDialog = ({ code, name: initName, open, onClose }: Props) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    if (open) {
      setName(initName || '');
    }
  }, [open]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
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
          <Button type="submit" style={{ margin: 'auto', marginTop: '32px' }}>
            Create new product
          </Button>
        </Stack>{' '}
      </form>
    </Modal>
  );
};

export default CreateProductDialog;
