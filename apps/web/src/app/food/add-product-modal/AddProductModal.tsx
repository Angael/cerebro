import { env } from '@/utils/env';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { FoodProduct } from '@cerebro/db';
import { Modal, Stack } from '@mantine/core';
import { memo } from 'react';
import SaveProductForm from '../save-product-form/SaveProductForm';
import FoodProductSummary from '../scanner/scanned-code/FoodProductSummary';

type Props = { foodProduct: FoodProduct | null; open: boolean; onClose: () => void };

const AddProductModal = ({ foodProduct, open, onClose }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Modal
      opened={open}
      onClose={onClose}
      fullScreen={isMobile}
      size="xl"
      title="Add product"
      zIndex={201}
    >
      <Stack gap="md">
        {foodProduct && (
          <>
            <FoodProductSummary foodProduct={foodProduct} />
            <SaveProductForm foodProduct={foodProduct} onClose={onClose} />
          </>
        )}

        {!env.IS_PROD && (
          <details>
            <summary>Show JSON</summary>
            <pre>{JSON.stringify(foodProduct, null, 2)}</pre>
          </details>
        )}
      </Stack>
    </Modal>
  );
};

export default memo(AddProductModal);
