import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { FoodProduct } from '@cerebro/db';
import { Modal, Stack } from '@mantine/core';
import { memo } from 'react';
import SaveProductForm from '../save-product-form/SaveProductForm';
import FoodProductSummary from '../scanner/scanned-code/FoodProductSummary';

interface Props {
  foodProduct?: FoodProduct | null;
  foodLog?: {
    id: number; // only id is used, rest is for optimistic loading
    brands: string | null;
    product_name: string;
    amount: number;
    kcal: number;
  };
  open: boolean;
  onClose: () => void;
}

const AddProductModal = ({ foodProduct, foodLog, open, onClose }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Modal
      opened={open}
      onClose={onClose}
      fullScreen={isMobile}
      size="lg"
      title={foodLog ? 'Edit product' : 'Add product'}
      zIndex={201}
    >
      <Stack gap="md">
        {foodLog && <pre>{JSON.stringify(foodLog, null, 2)}</pre>}
        {foodProduct && (
          <>
            <FoodProductSummary foodProduct={foodProduct} />
            <SaveProductForm foodProduct={foodProduct} onClose={onClose} />
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default memo(AddProductModal);
