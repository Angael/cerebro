import { API } from '@/utils/API';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { FoodProduct } from '@cerebro/db';
import { ActionIcon, Button, Modal, Stack, TextInput } from '@mantine/core';
import { mdiBarcode } from '@mdi/js';
import Icon from '@mdi/react';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import CustomProductBtn from './CustomProductBtn';

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenScanner: () => void;
  onChooseProduct: (foodProduct: FoodProduct) => void;
};

const FindProductDialog = ({ open, onClose, onOpenScanner, onChooseProduct }: Props) => {
  const [name, setName] = useState('');

  const autocomplete = useQuery({
    enabled: open,
    queryKey: ['autocomplete'],
    queryFn: () => API.get<FoodProduct[]>('/food/my-products').then((r) => r.data),
  });

  const fuse = useMemo(() => {
    return new Fuse(autocomplete.data ?? [], {
      keys: ['product_name', 'brands'],
    });
  }, [autocomplete.data]);

  const foodProducts = useMemo(() => {
    if (name === '') {
      return autocomplete.data ?? [];
    }

    const result = fuse.search(name).map((res) => res.item);

    return result;
  }, [fuse, name, autocomplete.data]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setName(value);
  };

  const onCreateProduct = () => {
    console.log(`Create product, ${name}`);
  };

  const isMobile = useIsMobile();

  return (
    <Modal opened={open} onClose={onClose} fullScreen={isMobile} size="xl" title="Find product">
      <Stack>
        <TextInput
          size="lg"
          label="Product name"
          placeholder="Banana"
          value={name}
          onChange={onChange}
          style={{ flex: 1 }}
          rightSection={
            <ActionIcon variant="transparent" aria-label="Scan" onClick={onOpenScanner}>
              <Icon path={mdiBarcode} size={1} />
            </ActionIcon>
          }
        />

        <Stack gap="xs">
          {foodProducts.map((foodProduct) => (
            <CustomProductBtn
              key={foodProduct.id}
              foodProduct={foodProduct}
              onProductSelect={onChooseProduct}
            />
          ))}
          <Button onClick={onCreateProduct} style={{ margin: 'auto', marginTop: '32px' }}>
            Create new product
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default FindProductDialog;
