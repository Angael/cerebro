import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { Alert, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Loader } from '@mantine/core';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import FoodProductSummary from './FoodProductSummary';

type Props = {
  code: string;
  onAccept: () => void;
  onReject: () => void;
};

const ScannedCode = ({ code, onAccept, onReject }: Props) => {
  const codeQuery = useQuery<QueryScannedCode>({
    enabled: !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<any>(`/food/barcode/${code}`).then((r) => r.data),
  });

  return (
    <Stack gap="md">
      {codeQuery.isLoading && <Loader />}
      {codeQuery.isError && (
        <Alert color="red">Error: {parseErrorResponse(codeQuery.error)?.general}</Alert>
      )}
      {codeQuery.isSuccess && <FoodProductSummary foodProduct={codeQuery.data} />}

      <details>
        <summary>Show JSON</summary>
        <pre>{JSON.stringify(codeQuery.data, null, 2)}</pre>
      </details>

      <Group justify="flex-end">
        <Button variant="subtle" onClick={onReject}>
          Reject
        </Button>
        <Button onClick={onAccept}>Accept</Button>
      </Group>
    </Stack>
  );
};

export default ScannedCode;
