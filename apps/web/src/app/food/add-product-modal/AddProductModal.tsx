import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Alert, Loader, Modal, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import SaveProductForm from '../save-product-form/SaveProductForm';
import FoodProductSummary from '../scanner/scanned-code/FoodProductSummary';
import { env } from '@/utils/env';
import { useIsMobile } from '@/utils/hooks/useIsMobile';

type Props = { code: string | null; open: boolean; onClose: () => void };

const AddProductModal = ({ code, open, onClose }: Props) => {
  const codeQuery = useQuery<QueryScannedCode>({
    enabled: !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<any>(`/food/barcode/${code}`).then((r) => r.data),
  });

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
        {codeQuery.isLoading && <Loader />}
        {codeQuery.isError && (
          <Stack>
            <Alert color="red">Error: {parseErrorResponse(codeQuery.error)?.general}</Alert>
          </Stack>
        )}

        {codeQuery.isSuccess && (
          <>
            <FoodProductSummary foodProduct={codeQuery.data} />
            <SaveProductForm foodProduct={codeQuery.data} onClose={onClose} />
          </>
        )}

        {!env.IS_PROD && (
          <details>
            <summary>Show JSON</summary>
            <pre>{JSON.stringify(codeQuery.data, null, 2)}</pre>
          </details>
        )}
      </Stack>
    </Modal>
  );
};

export default memo(AddProductModal);
