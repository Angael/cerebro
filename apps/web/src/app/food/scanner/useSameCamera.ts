import { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'lastUsedCameraDeviceId';

export const useSameCamera = (devices: MediaDeviceInfo[]) => {
  const [selectedDeviceId, _setSelectedDeviceId] = useState<string | null>(
    localStorage.getItem(LOCAL_STORAGE_KEY) || null,
  );
  const setSelectedDeviceId = (deviceId: string | null) => {
    _setSelectedDeviceId(deviceId);
    if (deviceId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, deviceId);
    }
  };

  // Set the first device as default
  useEffect(() => {
    if (devices.length < 1) {
      return;
    }

    // Check if the last used device is still available
    const storedDevice = devices.find((device) => device.deviceId === selectedDeviceId);
    if (!storedDevice) {
      setSelectedDeviceId(devices[0]!.deviceId);
    }
  }, [selectedDeviceId, devices]);

  const setNextDevice = () => {
    if (devices.length < 1) {
      // No devices available, show error?
      return;
    }

    if (!selectedDeviceId) {
      setSelectedDeviceId(devices[0]!.deviceId);
      return;
    }

    const currentIndex = devices.findIndex((device) => device.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setSelectedDeviceId(devices[nextIndex]!.deviceId);
  };

  return [selectedDeviceId, setNextDevice] as const;
};
