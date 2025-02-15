import { Alert, Button, Select, Stack } from '@mantine/core';
import clsx from 'clsx';
import { memo, useState } from 'react';
import css from './Scanner.module.css';
import { useDevices } from './useDevices';
import { useScanner } from './useScanner';
import { useVideo } from './useVideo';
import { env } from '@/utils/env';

type Props = {
  codeFoundCallback: (code: string[]) => void;
};

const Scanner = ({ codeFoundCallback }: Props) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  const { hasPermission, userMedia, devices, selectedDeviceId, setNextDevice, stream } =
    useDevices();
  useVideo(video, stream);
  const codes = useScanner(!!stream && !!selectedDeviceId, video, codeFoundCallback);

  if (!hasPermission) {
    return (
      <Alert variant="light" color="orange" title="Camera permission">
        You need to allow camera access to scan barcodes
      </Alert>
    );
  }

  if (!devices.length) {
    return (
      <Alert variant="light" color="orange" title="Camera permission">
        Your device does not have any cameras
      </Alert>
    );
  }

  return (
    <div className={css.vidWrapper}>
      {selectedDeviceId && (
        <video
          id="stream"
          ref={setVideo}
          className={clsx(css.cameraVideo, codes.length > 0 && css.codeFound)}
        />
      )}

      {devices.length > 1 && (
        <Button className={css.changeCameraBtn} onClick={setNextDevice}>
          Next camera
        </Button>
      )}

      {!env.IS_PROD && (
        <details className={css.debugDetails}>
          <summary>Debug Info</summary>
          <pre>
            {JSON.stringify({ userMedia }, null, 2)}
            {JSON.stringify({ devices }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default memo(Scanner);
