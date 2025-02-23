import { useUrlParam } from '@/utils/hooks/useUrlParam';
import { Alert, Badge, Box, Modal } from '@mantine/core';
import Scanner from './Scanner';
import ScannedCode from './scanned-code/ScannedCode';
import { QUERY_KEYS } from '@/utils/consts';
import { useQuery } from '@tanstack/react-query';
import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { API } from '@/utils/API';
import css from './ScannerModal.module.css';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onFound: () => void;
};

const ScannerModal = ({ open, onClose, onFound }: Props) => {
  const [code, setCode] = useUrlParam('barcode');

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
    if (codeQuery.isSuccess) {
      onFound();
    }
  }, [codeQuery.isSuccess]);

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
