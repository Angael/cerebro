import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { Button, Group, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

type Props = {
  code: string;
  onAccept: () => void;
  onReject: () => void;
};

const ScannedCode = ({ code, onAccept, onReject }: Props) => {
  const codeQuery = useQuery({
    enabled: !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<any>(`/food/barcode/${code}`).then((r) => r.data),
  });

  return (
    <Stack gap="md">
      <pre>{JSON.stringify(codeQuery.data, null, 2)}</pre>
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
