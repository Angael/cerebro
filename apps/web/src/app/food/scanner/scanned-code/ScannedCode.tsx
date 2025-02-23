import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { Alert, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Loader } from '@mantine/core';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import FoodProductSummary from './FoodProductSummary';
import { env } from '@/utils/env';
import SaveProductForm from '../../save-product-form/SaveProductForm';

type Props = {
  code: string;
  onClose: () => void;
};

const ScannedCode = ({ code, onClose }: Props) => {
  const codeQuery = useQuery<QueryScannedCode>({
    enabled: !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<any>(`/food/barcode/${code}`).then((r) => r.data),
  });

  return (
    <Stack gap="md">
      {codeQuery.isLoading && <Loader />}
      {codeQuery.isError && (
        <Stack>
          <Alert color="red">Error: {parseErrorResponse(codeQuery.error)?.general}</Alert>
          <Button onClick={onClose} variant="light">
            Close
          </Button>
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
  );
};

export default ScannedCode;
