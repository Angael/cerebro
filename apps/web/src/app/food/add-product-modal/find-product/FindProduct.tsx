import { API } from '@/utils/API';
import { QueryMyProducts } from '@cerebro/server/src/routes/food/food.model';
import { Button, Stack, TextInput } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import CustomProductBtn from './CustomProductBtn';

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
          <CustomProductBtn key={option.id} option={option} onProductSelect={onProductSelect} />
        ))}
        <Button onClick={onCreateProduct} style={{ margin: 'auto', marginTop: '32px' }}>
          Create new product
        </Button>
      </Stack>
    </Stack>
  );
};

export default FindProduct;
