import { Autocomplete, Button, Modal, Tabs } from '@mantine/core';
import { useState } from 'react';
import Scanner from './Scanner';
import ScannedCode from './scanned-code/ScannedCode';
import { env } from '@/utils/env';
import AddCustomFoodForm from './add-custom-food/AddCustomFoodForm';

type Props = {
  open: boolean;
  onClose: () => void;
};

const ScannerModal = ({ open, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'add-product' | 'add-custom'>('scan');

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
      title={code ? `Product: ${code}` : 'Add product'}
      zIndex={201}
    >
      <Tabs value={activeTab} onChange={setActiveTab as any}>
        <Tabs.List>
          <Tabs.Tab value="scan">Scanner</Tabs.Tab>
          <Tabs.Tab value="add-product">Add product</Tabs.Tab>
          <Tabs.Tab value="custom">Fast add</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="scan">
          {!code && <Scanner codeFoundCallback={codeFoundCallback} />}
          {code && <ScannedCode code={code} onAccept={() => {}} onReject={() => setCode(null)} />}
          {!env.IS_PROD && (
            <Button onClick={() => setCode('5900259128843')}>Scan lays chips</Button>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="add-product">
          <AddCustomFoodForm />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default ScannerModal;
