import { API } from '@/utils/API';
import { QueryMyProducts } from '@cerebro/server/src/routes/food/food.model';
import {
  Autocomplete,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

type Props = {};

const FindProduct = (props: Props) => {
  const [name, setName] = useState('');

  const autocomplete = useQuery({
    queryKey: ['autocomplete'],
    queryFn: () => API.get<QueryMyProducts>('/food/my-products').then((r) => r.data),
  });

  const autocompleteOptions = useMemo(() => {
    const fuse = new Fuse(autocomplete.data ?? [], {
      keys: ['product_name', 'brands'],
    });

    const result = fuse.search(name);

    console.log({ fuseResult: result });

    return result;
  }, [autocomplete.data, name]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    console.log('onChange', value);
    setName(value);
  };

  const onProductSelect = (id: string) => {
    console.log('Product selected', id);
  };

  const onCreateProduct = () => {
    console.log('Create product');
  };

  return (
    <Stack>
      <TextInput label="Product name" placeholder="Banana" value={name} onChange={onChange} />

      <Stack gap="xs">
        {autocompleteOptions.map((option) => (
          <Paper
            key={option.item.id}
            p="md"
            bg="dark.5"
            onClick={() => onProductSelect(String(option.item.id))}
          >
            <Group>
              <Stack flex={1} gap={0}>
                <Title order={5}>{option.item.product_name}</Title>
                <Text size="sm">{option.item.brands}</Text>
              </Stack>
              <Button onClick={() => onProductSelect(String(option.item.id))}>Select </Button>
            </Group>
          </Paper>
        ))}
        <Button onClick={onCreateProduct} color="blue">
          Create new product
        </Button>
      </Stack>
    </Stack>
  );
};

export default FindProduct;
