import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Alert, Box, Modal } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Scanner from './Scanner';
import css from './ScannerModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onFound: (code: string) => void;
};

const ScannerModal = ({ open, onClose, onFound }: Props) => {
  const [code, setCode] = useState<string | null>(null);

  const codeQuery = useQuery<QueryScannedCode>({
    enabled: !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<any>(`/food/barcode/${code}`).then((r) => r.data),
  });

  const codeFoundCallback = (codes: string[]) => {
    if (codes.length > 0) {
      setCode(codes[0]);
    }
  };

  useEffect(() => {
    if (open && code && codeQuery.isSuccess) {
      onFound(code);
      setCode(null);
    }
  }, [open, code, codeQuery.isSuccess]);

  return (
    <Modal opened={open} onClose={onClose} size="xl" title="Scan product">
      <Box pos="relative">
        <Scanner codeFoundCallback={codeFoundCallback} />
        {codeQuery.isError && (
          <div className={css.notFoundAlert}>
            <Alert color="red" variant="filled">
              {parseErrorResponse(codeQuery.error)?.general}
            </Alert>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ScannerModal;
