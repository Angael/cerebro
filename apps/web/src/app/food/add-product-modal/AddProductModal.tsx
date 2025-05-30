import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { FoodProduct } from '@cerebro/db';
import { LoadingOverlay, Modal, Stack } from '@mantine/core';
import { memo } from 'react';
import SaveProductForm from '../save-product-form/SaveProductForm';
import FoodProductSummary from '../scanner/scanned-code/FoodProductSummary';
import { Prettify } from '@/utils/types/Prettify.type';
import { FoodHistoryType } from '@/server/food/getFoodHistory';
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
    queryFn: () => getFoodProduct(foodLog!.food_product_id!),
  });

  return (
    <Modal
      opened={open}
      onClose={onClose}
      fullScreen={isMobile}
      size="lg"
      title={foodLog ? 'Edit product' : 'Add product'}
      zIndex={201}
    >
      <Stack gap="md" pos="relative">
        <LoadingOverlay visible={foodProductFromLog.isLoading} />
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
            <SaveProductForm
              logId={foodLog.id}
              foodProductId={foodLog.food_product_id!}
              product_quantity={foodProductFromLog.data?.product_quantity ?? null}
              kcal_100g={foodLog.kcal_100g}
              amount={foodLog.amount}
              onClose={onClose}
            />
          </>
        )}
        {foodProduct && (
          <>
            <FoodProductSummary {...foodProduct} />
            <SaveProductForm
              foodProductId={foodProduct.id}
              kcal_100g={foodProduct.kcal_100g}
              product_quantity={foodProduct.product_quantity}
              onClose={onClose}
            />
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default memo(AddProductModal);
