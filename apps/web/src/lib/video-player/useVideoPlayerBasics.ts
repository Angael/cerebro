import { FilePlayerProps } from 'react-player/file';
import { OnProgressProps } from 'react-player/base';
import { useState } from 'react';

type Args = {
  setSliderProgress: (playedFraction: number) => void;
};

export const useVideoPlayerBasics = ({ setSliderProgress }: Args) => {
  const [length, setLength] = useState(0);
  const [progress, setProgress] = useState(0);

  const onReady = (reactPlayer: FilePlayerProps) => {
    setLength(reactPlayer.getDuration());
  };

  const onProgress = (state: OnProgressProps) => {
    setProgress(state.played);
    setSliderProgress(state.played);
  };

  return {
    length,
    progress,
    onReady,
    onProgress,
  };
};
