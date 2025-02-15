import { env } from '@/utils/env';
import { Button, Group, Modal } from '@mantine/core';
import { mdiBarcode, mdiMagnify } from '@mdi/js';
import { memo, useCallback, useEffect, useState } from 'react';
import Scanner from '../scanner/Scanner';
import ScannedCode from '../scanner/scanned-code/ScannedCode';
import AddProductModeBtn from './AddProductModeBtn';
import FindProduct from './find-product/FindProduct';

type Props = { open: boolean; onClose: () => void };

const AddProductModal = ({ open, onClose }: Props) => {
  const [mode, setMode] = useState<'scan' | 'find-product' | null>(null);

  const [code, setCode] = useState<string | null>(null);
  const codeFoundCallback = useCallback((codes: string[]) => {
    if (codes.length > 0) {
      setCode(codes[0]);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setMode(null);
    }
  }, [open]);

  return (
    <Modal opened={open} onClose={onClose} size="xl" title="Add product" zIndex={201}>
      {mode === null && (
        <Group wrap="wrap">
          <AddProductModeBtn
            onClick={() => setMode('scan')}
            label="Scan barcode"
            icon={mdiBarcode}
          />
          <AddProductModeBtn
            onClick={() => setMode('find-product')}
            label="Find product"
            icon={mdiMagnify}
          />
        </Group>
      )}

      {mode === 'scan' && (
        <>
          {!code && <Scanner codeFoundCallback={codeFoundCallback} />}
          {code && <ScannedCode code={code} onAccept={() => {}} onReject={() => setCode(null)} />}
          {!env.IS_PROD && !code && (
            <Button onClick={() => setCode('5900259128843')}>Scan lays chips</Button>
          )}
        </>
      )}

      {mode === 'find-product' && <FindProduct />}
    </Modal>
  );
};

export default memo(AddProductModal);
