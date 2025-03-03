import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { FoodProduct } from '@cerebro/db';
import { Alert, Box, Modal } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Scanner from './Scanner';
import css from './ScannerModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onFound: (code: string) => void;
};

const ScannerModal = ({ open, onClose, onFound }: Props) => {
  const [code, setCode] = useState<string | null>(null);

  const codeQuery = useQuery({
    enabled: !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<FoodProduct>(`/food/barcode/${code}`).then((r) => r.data),
    refetchOnWindowFocus: true,
  });
  console.log(codeQuery.status);

  const codeFoundCallback = (codes: string[]) => {
    if (codes.length > 0) {
      setCode(codes[0]);
    }
  };

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (open && code && codeQuery.isSuccess) {
      onFound(code);
      setCode(null);
    }

    if (open && code && codeQuery.status === 'error') {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCode(null);
      }, 3000);
    }
  }, [open, code, codeQuery.status]);

  const isMobile = useIsMobile();

  return (
    <Modal opened={open} onClose={onClose} fullScreen={isMobile} size="xl" title="Scan product">
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
