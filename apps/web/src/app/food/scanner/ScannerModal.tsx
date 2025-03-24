import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { useIsMobile } from '@/utils/hooks/useIsMobile';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { FoodProduct } from '@cerebro/db';
import { Box, Modal } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Scanner from './Scanner';
import ScannerFeedback from './ScannerFeedback';

type Props = {
  open: boolean;
  onClose: () => void;
  onFound: (foodProduct: FoodProduct) => void;
  onCreateProduct: (code: string) => void;
};

const ScannerModal = ({ open, onClose, onFound, onCreateProduct }: Props) => {
  const [code, setCode] = useState<string | null>(null);

  const codeQuery = useQuery({
    enabled: open && !!code,
    queryKey: [QUERY_KEYS.foodByBarcode, { barcode: code }],
    queryFn: () => API.get<FoodProduct>(`/food/barcode/${code}`).then((r) => r.data),
    refetchOnWindowFocus: true,
  });

  const codeFoundCallback = (codes: string[]) => {
    if (codes.length > 0) {
      setCode(codes[0]);
    }
  };

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (open && code && codeQuery.isSuccess) {
      onFound(codeQuery.data);
      setCode(null);
    }

    if (open && code && codeQuery.status === 'error') {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCode(null);
      }, 5000);
    }
  }, [open, code, codeQuery.status]);

  const isMobile = useIsMobile();

  return (
    <Modal opened={open} onClose={onClose} fullScreen={isMobile} size="xl" title="Scan product">
      <Box pos="relative">
        <Scanner codeFoundCallback={codeFoundCallback} />
      </Box>
      <ScannerFeedback
        code={code}
        error={
          !codeQuery.isFetching && codeQuery.isError && codeQuery.error
            ? parseErrorResponse(codeQuery.error)?.general
            : null
        }
        onClose={() => setCode(null)}
        onCreateProduct={() => onCreateProduct(code!)}
      />
    </Modal>
  );
};

export default ScannerModal;
