import CardBtn from '@/lib/card-btn/CardBtn';
import FoodMacros from '@/lib/food-macros/FoodMacros';
import { API } from '@/utils/API';
import { QueryMyProducts } from '@cerebro/server/src/routes/food/food.model';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

type Props = {};

const FindProduct = (props: Props) => {
  const [name, setName] = useState('');

  const autocomplete = useQuery({
    queryKey: ['autocomplete'],
    queryFn: () => API.get<QueryMyProducts>('/food/my-products').then((r) => r.data),
  });

  const fuse = useMemo(() => {
    return new Fuse(autocomplete.data ?? [], {
      keys: ['product_name', 'brands'],
    });
  }, [autocomplete.data]);

  const autocompleteOptions = useMemo(() => {
    if (name === '') {
      return autocomplete.data ?? [];
    }

    const result = fuse.search(name).map((res) => res.item);

    return result;
  }, [fuse, name, autocomplete.data]);

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
          <CardBtn
            key={option.id}
            onClick={() => onProductSelect(String(option.id))}
            pos="relative"
            p="sm"
          >
            <Stack gap="xs">
              <Group>
                <Stack flex={1} gap={0}>
                  <Title order={5}>{option.product_name}</Title>
                  <Text size="sm">{option.brands}</Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="sm">
                    {option.kcal_100g} kcal{' '}
                    <Text component="span" size="sm" c="gray.6">
                      / 100g
                    </Text>
                  </Text>
                </Stack>
              </Group>
              <FoodMacros
                carbs={option.carb_100g}
                fats={option.fat_100g}
                proteins={option.proteins_100g}
              />
            </Stack>
          </CardBtn>
        ))}
        <Button onClick={onCreateProduct} style={{ margin: 'auto', marginTop: '32px' }}>
          Create new product
        </Button>
      </Stack>
    </Stack>
  );
};

export default FindProduct;
