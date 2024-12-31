import { API } from '@/utils/API';
import { QueryMyProducts } from '@cerebro/server/src/routes/food/food.routes';
import { Autocomplete, Group, LoadingOverlay, Stack, TextInput, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

type Props = {};

const AddCustomFoodForm = (props: Props) => {
  const [name, setName] = useState('');

  const autocomplete = useQuery({
    queryKey: ['autocomplete'],
    queryFn: () => API.get<QueryMyProducts>('/food/my-products').then((r) => r.data),
  });

  const autocompleteOptions = useMemo(() => {
    return (
      autocomplete.data?.map((item) => ({ value: String(item.id), label: item.product_name })) ?? []
    );
  }, [autocomplete.data]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name);
  };

  const existingProduct = autocomplete.data?.find((item) => item.product_name === name);

  return (
    <Stack>
      <form onSubmit={onSubmit}>
        <Group my="md">
          <Autocomplete
            label="Product name"
            placeholder="Banana"
            data={autocompleteOptions}
            onChange={(value) => setName(value)}
            value={name}
            required
            style={{ flex: 1 }}
          />
          <TextInput
            label="Brand"
            placeholder="Lay's"
            style={{ flex: 1 }}
            disabled={!!existingProduct}
          />
        </Group>
        <Stack style={{ position: 'relative' }} my="md">
          <LoadingOverlay visible={autocomplete.isPending} />

          <TextInput label="Amount" placeholder="70" />

          <TextInput label="Barcode" placeholder="5900259128843" disabled={!!existingProduct} />
          <TextInput
            label="Calories in 100g"
            required
            placeholder="120"
            disabled={!!existingProduct}
          />
        </Stack>
      </form>
    </Stack>
  );
};

export default AddCustomFoodForm;
