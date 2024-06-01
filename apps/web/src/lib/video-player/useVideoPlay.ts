import React, { startTransition, SyntheticEvent, useEffect, useRef } from 'react';

type Args = {
  reactPlayerRef: React.MutableRefObject<any>;
  isSeeking: React.MutableRefObject<boolean>;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  briefShowUi: (shouldHide: boolean, immediateHide?: boolean, hideTimeoutMs?: number) => void;
};

// TODO: usePlayback?
export const useVideoPlay = ({
  reactPlayerRef,
  isSeeking,
  playing,
  setPlaying,
  briefShowUi,
}: Args) => {
  const seekContinuePlaying = useRef<boolean>(false);

  const handleSeek = (progressFromSlider: number) => {
    isSeeking.current = true;
    reactPlayerRef.current?.seekTo(progressFromSlider, 'fraction');
    startTransition(() => {
      setPlaying(false);
      briefShowUi(playing, false);
    });
  };

  const onClickVideo = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.nativeEvent.pointerType === 'touch') {
      // TODO: hide UI if visible,
      briefShowUi(true, false, 2000);
      return;
    }
    onPlay(e);
  };

  const onPlay = (e: SyntheticEvent) => {
    e.stopPropagation();
    isSeeking.current = false;
    seekContinuePlaying.current = false;

    const newPlaying = !playing;
    setPlaying(newPlaying);
    briefShowUi(newPlaying, true);
  };

  const handleSliderPointerStartEvent = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    seekContinuePlaying.current = playing;
    setPlaying(false);
  };

  useEffect(() => {
    const onMouseUp = (e: any) => {
      if (seekContinuePlaying.current) {
        setPlaying(true);
        seekContinuePlaying.current = false;
        isSeeking.current = false;
      }
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  return {
    handleSeek,
    handleSliderPointerStartEvent,
    onClick: onClickVideo,
    onPlay,
  };
};
