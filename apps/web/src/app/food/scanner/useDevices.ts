import { useEffect, useState } from 'react';

export const useDevices = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [userMedia, setUserMedia] = useState<any>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // log all state
  console.log({ hasPermission, selectedDevice, devices, userMedia, stream });

  const selectDevice = (deviceId: string | null) => {
    setSelectedDevice(deviceId);
  };

  // Get camera permission
  useEffect(() => {
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
      } catch (error) {
        console.error('Permission denied:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  // Find all video devices
  useEffect(() => {
    if (hasPermission) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setDevices(devices.filter((device) => device.kind === 'videoinput' && device.label));
      });
    }
  }, [hasPermission]);

  // Get stream
  useEffect(() => {
    if (!selectedDevice || !hasPermission) {
      return;
    }

    let _stream: MediaStream;
    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedDevice, width: 1920, height: 1080 },
      })
      .then((stream) => {
        const videoTracks = Array.from(stream.getVideoTracks()).map((track) => {
          return track.getSettings();
        });
        console.log(videoTracks);
        setUserMedia(videoTracks);

        _stream = stream;
        setStream(stream);
      });

    return () => {
      if (_stream) {
        _stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    };
  }, [hasPermission, selectedDevice]);

  return { hasPermission, userMedia, selectedDevice, devices, selectDevice, stream };
};
