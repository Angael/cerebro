'use client';

import { editFoodProduct } from '@/server/food/editFoodProduct';
import { getFoodProduct } from '@/server/food/getFoodProduct';
import { QUERY_KEYS } from '@/utils/consts';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { Alert, Button, Fieldset, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

type Props = {
  product: Awaited<ReturnType<typeof getFoodProduct>>;
};

const EditProductForm = ({ product }: Props) => {
  const editProduct = useMutation({
    mutationFn: async () => {
      const response = await editFoodProduct({
        id: 'qq',
        product_name: 'test',
        brands: 'brands',
        image_url: 'image_url',
        kcal_100g: 2,
        product_quantity: 100,
      });

      console.log(response.error);

      if (response.error) {
        throw response.error;
      }
    },
    meta: {
      invalidateQueryKey: [QUERY_KEYS.getFoodProduct],
      error: {
        title: 'Error editing product',
        message: 'Please try again later.',
      },
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editProduct.mutate();
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexFlow: 'column', gap: '1rem' }}>
      <input type="hidden" name="id" value={product.id} />

      {editProduct.isError && (
        <Alert title="Error" color="red">
          {parseErrorResponse(editProduct.error)?.general}
        </Alert>
      )}

      <Fieldset legend="Product Description" variant="default">
        <Stack>
          <TextInput name="barcode" label="Barcode" defaultValue={product.barcode ?? ''} />
          <Group grow wrap="wrap">
            <TextInput
              name="product_name"
              label="Name"
              defaultValue={product.product_name}
              required
              style={{ minWidth: 100 }}
            />
            <TextInput name="brands" label="Brand" defaultValue={product.brands ?? ''} />
          </Group>
          <TextInput name="image_url" label="Image URL" defaultValue={product.image_url ?? ''} />
        </Stack>
      </Fieldset>

      <Fieldset legend="Quantity" variant="default">
        <Stack>
          <NumberInput
            name="kcal_100g"
            label="Calories per 100g"
            defaultValue={product.kcal_100g ?? undefined}
            step={1}
            min={0}
            required
          />

          <NumberInput
            name="product_quantity"
            label="Product Quantity (grams)"
            description="This is the total weight of the product in grams."
            defaultValue={product.product_quantity ?? undefined}
            placeholder="e.g. 100 g"
            rightSection={'gram'}
            rightSectionWidth={60}
            step={1}
            min={0}
            flex={3}
          />
        </Stack>
      </Fieldset>

      <Button type="submit" ml="auto" loading={editProduct.isPending}>
        Save Changes
      </Button>
    </form>
  );
};

export default EditProductForm;
