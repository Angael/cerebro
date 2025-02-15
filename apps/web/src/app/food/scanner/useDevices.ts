import { useEffect, useRef, useState } from 'react';
import { useSameCamera } from './useSameCamera';
import { notifications } from '@mantine/notifications';

const tryGetPreferredCamera = async (selectedDeviceId: string | null) => {
  let usedFallback = false;
  let stream = await navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { facingMode: 'environment', deviceId: selectedDeviceId || undefined },
    })
    .catch(() => {
      usedFallback = true;
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
      });
    })
    .catch(() => {
      usedFallback = true;
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
    });

  return { stream, usedFallback };
};

export const useDevices = (video: HTMLVideoElement | null) => {
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setNextDevice] = useSameCamera(devices);

  // Get camera permission and find all video devices
  useEffect(() => {
    let isMounted = true;

    setInitialized(false);
    (async () => {
      try {
        const { stream, usedFallback } = await tryGetPreferredCamera(selectedDeviceId);
        mediaStreamRef.current = stream;

        if (usedFallback) {
          notifications.show({
            title: 'Camera',
            message: 'Something went wrong with the camera, using other one',
            color: 'orange',
          });
        }

        if (isMounted) {
          setHasPermission(true);
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            if (isMounted) {
              setDevices(devices.filter((device) => device.kind === 'videoinput' && device.label));
              setInitialized(true);
            }
          });
        }
      } catch (error) {
        console.error('Permission denied:', error);
        if (isMounted) {
          setHasPermission(false);
          setInitialized(true);
        }
      }
    })();

    return () => {
      isMounted = false;

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    };
  }, [selectedDeviceId]);

  // Get stream
  useEffect(() => {
    if (!selectedDeviceId || !hasPermission || !mediaStreamRef.current || !initialized || !video) {
      return;
    }

    const stream = mediaStreamRef.current;
    video.srcObject = stream;
    video.play();
  }, [video, initialized, hasPermission, selectedDeviceId]);

  return {
    hasPermission,
    initialized,
    selectedDeviceId,
    devices,
    setNextDevice,
  };
};
