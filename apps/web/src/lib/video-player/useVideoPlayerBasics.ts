import ReactPlayer, { FilePlayerProps } from 'react-player/file';
import { OnProgressProps } from 'react-player/base';
import { useRef, useState } from 'react';

type Args = {
  setSliderProgress: (playedFraction: number) => void;
};

export const useVideoPlayerBasics = ({ setSliderProgress }: Args) => {
  const reactPlayerRef = useRef<ReactPlayer>(null);

  const [length, setLength] = useState(0);
  const [progress, setProgress] = useState(0);

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

  return { reactPlayerRef, length, progress, onReady, onProgress, onFullScreen };
};
