import { Modal } from '@mantine/core';

type Props = {
  open: boolean;
  onClose: () => void;
};

const Scanner = ({ open, onClose }: Props) => {
  return (
    <Modal opened={open} onClose={onClose} size="xl" title="Scan barcode" zIndex={201}>
      Tutaj scanner
    </Modal>
  );
};

export default Scanner;
