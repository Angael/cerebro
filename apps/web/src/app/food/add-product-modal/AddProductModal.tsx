import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { FoodProduct } from '@cerebro/db';
import { Modal, Stack } from '@mantine/core';
import { memo } from 'react';
import SaveProductForm from '../save-product-form/SaveProductForm';
import FoodProductSummary from '../scanner/scanned-code/FoodProductSummary';
import { Prettify } from '@/utils/types/Prettify.type';
import { FoodHistoryType } from '@/server/getFoodHistory';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { getFoodProduct } from '@/server/food/getFoodProduct';

interface BaseProps {
  open: boolean;
  onClose: () => void;
}

type Props = Prettify<
  BaseProps &
    (
      | {
          foodProduct?: never;
          foodLog: FoodHistoryType[number];
        }
      | {
          foodProduct: FoodProduct | null;
          foodLog?: never;
        }
    )
>;

const AddProductModal = ({ foodProduct, foodLog, open, onClose }: Props) => {
  const isMobile = useIsMobile();

  const foodProductFromLog = useQuery({
    enabled: open && !!foodLog?.food_product_id,
    queryKey: [QUERY_KEYS.getFoodProduct, foodLog?.food_product_id],
    queryFn: async () => getFoodProduct(foodLog!.food_product_id!),
  });

  const foodProductDataFromLog = foodLog
    ? (foodProductFromLog.data ?? {
        brands: foodLog.brands,
        product_name: foodLog.product_name,
        kcal_100g: foodLog.kcal_100g,
        amount: 0,
      })
    : null;

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
        {foodLog && (
          <>
            {foodProductFromLog.data ? (
              <FoodProductSummary
                product_name={foodProductFromLog.data.product_name}
                brands={foodProductFromLog.data.brands}
                kcal_100g={foodProductFromLog.data.kcal_100g}
                image_url={foodProductFromLog.data.image_url}
                product_quantity={foodProductFromLog.data.product_quantity}
                product_quantity_unit={foodProductFromLog.data.product_quantity_unit}
              />
            ) : (
              <FoodProductSummary
                product_name={foodLog.product_name}
                brands={foodLog.brands}
                kcal_100g={foodLog.kcal_100g}
              />
            )}
          </>
        )}
        {foodProduct && (
          <>
            <FoodProductSummary {...foodProduct} />
            <SaveProductForm foodProduct={foodProduct} onClose={onClose} />
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default memo(AddProductModal);
