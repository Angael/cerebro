import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'lastUsedCameraDeviceId';

export const useSameCamera = (devices: MediaDeviceInfo[]) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (devices.length < 1) {
      // No devices available, show error?
      return;
    }

    const storedDeviceId = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedDevice = storedDeviceId
      ? devices.find((device) => device.deviceId === storedDeviceId)
      : null;

    setSelectedDeviceId(storedDevice?.deviceId || devices[0]!.deviceId);
  }, [devices]);

  useEffect(() => {
    if (selectedDeviceId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, selectedDeviceId);
    }
  }, [selectedDeviceId]);

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
