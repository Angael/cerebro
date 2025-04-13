import { ActionIcon, Alert, Button, Collapse, Stack, Text, Title, Transition } from '@mantine/core';
import css from './ScannerFeedback.module.css';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

type Props = {
  code: string | null;
  error: string | null | undefined;
  onClose: () => void;
  onCreateProduct: () => void;
};

const ScannerFeedback = ({ code, error, onClose, onCreateProduct }: Props) => {
  return (
    <Transition
      mounted={!!code}
      transition="fade"
      duration={300}
      timingFunction="ease"
      exitDuration={0}
    >
      {(styles) => (
        <Alert className={css.scannerFeedback} variant="filled" color="dark" style={styles}>
          {error && (
            <ActionIcon onClick={onClose} variant="transparent" className={css.closeBtn}>
              <Icon path={mdiClose} size={1} />
            </ActionIcon>
          )}
          <Text size="xs" c="gray.6">
            Code: {code}
          </Text>
          <Stack gap={0}>
            <Text>{error ? error : 'Loading...'}</Text>
            <Collapse in={!!error} ml="auto">
              <Button mt="md" onClick={onCreateProduct}>
                Create product
              </Button>
            </Collapse>
          </Stack>
        </Alert>
      )}
    </Transition>
  );
};

export default ScannerFeedback;
