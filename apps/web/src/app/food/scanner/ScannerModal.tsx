import { Modal } from '@mantine/core';
import { useState } from 'react';
import Scanner from './Scanner';
import ScannedCode from './scanned-code/ScannedCode';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ScannerModal = ({ open, onClose }: Props) => {
  const [code, setCode] = useState<string | null>(null);

  const codeFoundCallback = (codes: string[]) => {
    if (codes.length > 0) {
      setCode(codes[0]);
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      size="xl"
      title={code ? `Product: ${code}` : 'Scan barcode'}
      zIndex={201}
    >
      {!code && <Scanner codeFoundCallback={codeFoundCallback} />}

      {code && <ScannedCode code={code} onAccept={() => {}} onReject={() => setCode(null)} />}
    </Modal>
  );
};

export default ScannerModal;