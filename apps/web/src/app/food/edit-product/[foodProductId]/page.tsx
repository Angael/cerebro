import SimpleError from '@/app/error';
import { requireUser } from '@/server/auth/getUser';
import { editFoodProduct } from '@/server/food/editFoodProduct';
import { getFoodProduct } from '@/server/food/getFoodProduct';
import { Button, NumberInput, Stack, Text, TextInput, Title } from '@mantine/core';
import Form from 'next/form';

const EditProductPage = async ({ params }: { params: Promise<{ foodProductId: string }> }) => {
  const [user, product] = await Promise.all([
    requireUser(),
    getFoodProduct(Number((await params).foodProductId)),
  ]);

  console.log('User:', user);
  console.log('Product:', product);

  const canEdit = user.type === 'ADMIN' || user.id === product.user_id;
  if (!canEdit) {
    return (
      <SimpleError title="Unauthorized" text="You do not have permission to edit this product." />
    );
  }

  return (
    <Stack>
      <Title>Edit Product</Title>
      <Text>This is the edit product page.</Text>

      <Form action={editFoodProduct}>
        <pre>{JSON.stringify(product, null, 2)}</pre>
        <TextInput name="product_name" label="Product Name" defaultValue={product.product_name} />
        <Button type="submit" color="blue">
          Save Changes
        </Button>
      </Form>
    </Stack>
  );
};

export default EditProductPage;
