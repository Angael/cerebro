import { Group, Modal } from '@mantine/core';
import { useEffect, useState } from 'react';
import AddProductModeBtn from './AddProductModeBtn';
import { mdiBarcode, mdiMagnify } from '@mdi/js';

type Props = { open: boolean; onClose: () => void };

const AddProductModal = ({ open, onClose }: Props) => {
  const [mode, setMode] = useState<'scan' | 'find-product' | null>(null);

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
    </Modal>
  );
};

export default AddProductModal;
