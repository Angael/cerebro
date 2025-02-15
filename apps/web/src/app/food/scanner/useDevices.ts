import { useEffect, useState } from 'react';
import { useSameCamera } from './useSameCamera';

export const useDevices = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setNextDevice] = useSameCamera(devices);
  const [userMedia, setUserMedia] = useState<any>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // log all state
  console.log('useDevices');

  // Get camera permission
  useEffect(() => {
    (async () => {
      console.log('get camera permission');
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
    console.log('find all video devices');
    if (hasPermission) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setDevices(devices.filter((device) => device.kind === 'videoinput' && device.label));
      });
    }
  }, [hasPermission]);

  // Get stream
  useEffect(() => {
    console.log('get stream', { hasPermission, selectedDeviceId });
    if (!selectedDeviceId || !hasPermission) {
      return;
    }

    let isMounted = true;
    let _stream: MediaStream;
    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: selectedDeviceId, facingMode: 'environment' },
      })
      .then((stream) => {
        if (!isMounted) {
          console.log('Get stream is not mounted anymore');
          return;
        }

        const videoTracks = Array.from(stream.getVideoTracks())
          .map((track) => {
            if (track.enabled) {
              return track.getSettings();
            } else {
              return null;
            }
          })
          .filter((track) => track !== null);
        console.log(videoTracks);
        setUserMedia(videoTracks);

        _stream = stream;
        setStream(stream);
      })
      .catch((error) => {
        console.error('Error starting video stream:', error);
        // Handle the error appropriately, e.g., by setting an error state or trying a different device.
        // For example, you might want to reset the selectedDeviceId to null or try the next available device.
        // setNextDevice(null);
      });

    return () => {
      isMounted = false;
      if (_stream) {
        _stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    };
  }, [hasPermission, selectedDeviceId]);

  return {
    hasPermission,
    userMedia,
    selectedDeviceId,
    devices,
    setNextDevice,
    stream,
  };
};
