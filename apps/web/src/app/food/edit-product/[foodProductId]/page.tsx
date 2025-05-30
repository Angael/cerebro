import SimpleError from '@/app/error';
import { requireUser } from '@/server/auth/getUser';
import { editFoodProduct } from '@/server/food/editFoodProduct';
import { getFoodProduct } from '@/server/food/getFoodProduct';
import { Button, Fieldset, Group, NumberInput, Stack, Text, TextInput, Title } from '@mantine/core';
import Form from 'next/form';

const EditProductPage = async ({ params }: { params: Promise<{ foodProductId: string }> }) => {
  const [user, product] = await Promise.all([
    requireUser(),
    getFoodProduct(Number((await params).foodProductId)),
  ]);

  const canEdit = user.type === 'ADMIN' || user.id === product.user_id;
  if (!canEdit) {
    return (
      <SimpleError title="Unauthorized" text="You do not have permission to edit this product." />
    );
  }

  return (
    <Stack>
      <Title>Edit Product</Title>
      <details>
        <summary>Debug Info</summary>
        <pre>{JSON.stringify(product, null, 2)}</pre>
      </details>

      <Form action={editFoodProduct}>
        <Fieldset legend="Product Description" variant="default" mb="md">
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

        <Fieldset legend="Quantity" variant="default" mb="md">
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

        <Button type="submit" color="blue" ml="auto">
          Save Changes
        </Button>
      </Form>
    </Stack>
  );
};

export default EditProductPage;
