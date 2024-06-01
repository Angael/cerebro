import ReactPlayer, { FilePlayerProps } from 'react-player/file';
import { OnProgressProps } from 'react-player/base';
import { useRef, useState } from 'react';
import { env } from '@/utils/env';
import { useVideoProgressSlider } from '@/lib/video-player/useVideoProgressSlider';

export const useVideoPlayerBasics = () => {
  const { sliderRef, setSliderProgress } = useVideoProgressSlider();
  const reactPlayerRef = useRef<ReactPlayer>(null);

  const [length, setLength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(env.IS_PROD ? 0.8 : 0.2);

  const setVolumeLimited = (volume: number) => {
    setVolume(Math.max(Math.min(volume, 1), 0));
  };

  const onReady = (reactPlayer: FilePlayerProps) => {
    setLength(reactPlayer.getDuration());
  };

  const onProgress = (state: OnProgressProps) => {
    setProgress(state.played);
    setSliderProgress(state.played);
  };

  const onFullScreen = () => {
    const player = reactPlayerRef.current?.getInternalPlayer();
    if (player?.requestFullscreen) {
      player.requestFullscreen();
    } else if (player?.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    } else if (player?.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player?.msRequestFullscreen) {
      player.msRequestFullscreen();
    }
  };

  return {
    reactPlayerRef,
    sliderRef,
    length,
    progress,
    volume,
    onReady,
    onProgress,
    onFullScreen,
    setVolumeLimited,
  };
};
