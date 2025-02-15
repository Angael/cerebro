import { env } from '@/utils/env';
import { Alert, Button, LoadingOverlay } from '@mantine/core';
import clsx from 'clsx';
import { memo, useState } from 'react';
import css from './Scanner.module.css';
import { useDevices } from './useDevices';
import { useScanner } from './useScanner';

type Props = {
  codeFoundCallback: (code: string[]) => void;
};

const Scanner = ({ codeFoundCallback }: Props) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  const { initialized, hasPermission, devices, selectedDeviceId, setNextDevice } =
    useDevices(video);

  useScanner(!!initialized && !!selectedDeviceId, video, codeFoundCallback);

  if (initialized && !hasPermission) {
    return (
      <Alert variant="light" color="orange" title="Camera permission">
        You need to allow camera access to scan barcodes
      </Alert>
    );
  }

  if (initialized && !devices.length) {
    return (
      <Alert variant="light" color="orange" title="Camera permission">
        Your device does not have any cameras
      </Alert>
    );
  }

  const selectedDeviceIndex = devices.findIndex((device) => device.deviceId === selectedDeviceId);
  const selectedDeviceName = devices[selectedDeviceIndex]?.label || 'Unknown device';

  return (
    <div className={css.vidWrapper}>
      <LoadingOverlay visible={!initialized} />

      {initialized && selectedDeviceId && (
        <video id="stream" ref={setVideo} className={clsx(css.cameraVideo)} />
      )}

      {devices.length > 1 && (
        <Button className={css.changeCameraBtn} onClick={setNextDevice} disabled={!initialized}>
          Next camera ({selectedDeviceIndex + 1}/{devices.length})
        </Button>
      )}

      {!env.IS_PROD && (
        <details className={css.debugDetails}>
          <summary>Debug Info {selectedDeviceName}</summary>
          <pre>{JSON.stringify({ devices }, null, 2)}</pre>
        </details>
      )}
    </div>
  );
};

export default memo(Scanner);
