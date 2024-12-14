import { useEffect, useState } from 'react';

// Ta strona to jezus: https://www.dynamsoft.com/codepool/camera-focus-control-on-web.html
export const useVideo = (videoElement: HTMLVideoElement | null, stream: MediaStream | null) => {
  // play camera in the videoElement
  useEffect(() => {
    if (!videoElement || !stream) {
      return;
    }

    // stream.getVideoTracks()[0].applyConstraints({
    //   advanced: [
    //     {
    //       focusMode: "manual",
    //       focusDistance: 2
    //     }
    //   ]
    // } as any);

    // setDebug(navigator.mediaDevices.getSupportedConstraints());
    // console.log(stream.getVideoTracks());

    videoElement.srcObject = stream;
    videoElement.play();
  }, [videoElement, stream]);
};
