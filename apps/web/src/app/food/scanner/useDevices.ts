import { useEffect, useRef, useState } from 'react';
import { useSameCamera } from './useSameCamera';

const tryGetPreferredCamera = async (selectedDeviceId: string | null) => {
  let stream = await navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: { facingMode: 'environment', deviceId: selectedDeviceId || undefined },
    })
    .catch(() =>
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
      }),
    )
    .catch(() =>
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      }),
    );

  return stream;
};

export const useDevices = (video: HTMLVideoElement | null) => {
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setNextDevice] = useSameCamera(devices);

  // log all state
  console.log('useDevices', {
    hasPermission,
    initialized,
    selectedDeviceId,
    devices,
    mediaStreamRef,
  });

  // Get camera permission and find all video devices
  useEffect(() => {
    console.log('get camera permission and find all video devices');
    let isMounted = true;

    setInitialized(false);
    (async () => {
      try {
        mediaStreamRef.current = await tryGetPreferredCamera(selectedDeviceId);

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
    };
  }, [selectedDeviceId]);

  // Get stream
  useEffect(() => {
    console.log('get stream', {
      hasPermission,
      selectedDeviceId,
      mediaStreamRef: mediaStreamRef.current,
      initialized,
    });
    if (!selectedDeviceId || !hasPermission || !mediaStreamRef.current || !initialized || !video) {
      return;
    }

    const stream = mediaStreamRef.current;
    video.srcObject = stream;
    video.play();
    // const videoTracks = Array.from(stream.getVideoTracks())
    //   .map((track) => {
    //     if (track.enabled) {
    //       return track.getSettings();
    //     } else {
    //       return null;
    //     }
    //   })
    //   .filter((track) => track !== null);
    // console.log({ videoTracks });

    return () => {
      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    };
  }, [video, initialized, hasPermission, selectedDeviceId]);

  return {
    hasPermission,
    initialized,
    selectedDeviceId,
    devices,
    setNextDevice,
  };
};
