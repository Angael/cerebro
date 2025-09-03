import SimpleError from '@/app/error';
import { requireUser } from '@/server/auth/getUser';
import { getFoodProduct } from '@/server/food/getFoodProduct';
import { clientEnv } from '@/utils/clientEnv';
import { Stack, Title } from '@mantine/core';
import EditProductForm from './EditProductForm';

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

      {!clientEnv.IS_PROD && (
        <details>
          <summary>Debug Info</summary>
          <pre>{JSON.stringify(product, null, 2)}</pre>
        </details>
      )}

      <EditProductForm product={product} />
    </Stack>
  );
};

export default EditProductPage;
