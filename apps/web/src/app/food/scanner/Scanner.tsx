import { Alert, Select, Stack } from '@mantine/core';
import clsx from 'clsx';
import { useState } from 'react';
import css from './Scanner.module.css';
import { useDevices } from './useDevices';
import { useScanner } from './useScanner';
import { useVideo } from './useVideo';

type Props = {
  codeFoundCallback: (code: string[]) => void;
};

const Scanner = ({ codeFoundCallback }: Props) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  const { hasPermission, userMedia, devices, selectedDevice, selectDevice, stream } = useDevices();
  useVideo(video, stream);
  const codes = useScanner(!!stream && !!selectedDevice, video, codeFoundCallback);

  if (!hasPermission) {
    return (
      <Alert color="orange" title="Camera permission">
        You need to allow camera access to scan barcodes
      </Alert>
    );
  }

  return (
    <Stack spacing="md">
      <Select
        label="Select camera"
        placeholder="Pick value"
        value={selectedDevice}
        data={devices.map((device) => ({
          value: device.deviceId,
          label: device.label,
        }))}
        onChange={(value) => selectDevice(value)}
        disabled={!devices.length}
      />

      {selectedDevice && (
        <video
          id="stream"
          ref={setVideo}
          className={clsx(css.cameraVideo, codes.length > 0 && css.codeFound)}
        />
      )}

      <details>
        <summary>Debug Info</summary>
        <pre>
          {JSON.stringify({ userMedia }, null, 2)}
          {JSON.stringify({ devices }, null, 2)}
        </pre>
      </details>
    </Stack>
  );
};

export default Scanner;
