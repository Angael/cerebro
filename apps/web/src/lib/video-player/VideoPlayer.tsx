import React, { startTransition, useEffect, useRef, useState } from 'react';
import ReactPlayer, { FilePlayerProps } from 'react-player/file';
import { OnProgressProps } from 'react-player/base';
import css from './VideoPlayer.module.scss';
import { ActionIcon, Slider } from '@mantine/core';
import { env } from '@/utils/env';
import numeral from 'numeral';
import Icon from '@mdi/react';
import { mdiPause, mdiPlay } from '@mdi/js';
import clsx from 'clsx';

type Props = {
  url: string;
} & React.ComponentProps<typeof ReactPlayer>;

const VideoPlayer = ({ url, ...other }: Props) => {
  const currentTimeText = useRef<string>('00:00');
  const ref = useRef<ReactPlayer>(null);
  const sliderRef = useRef<any>(null);
  const seekContinuePlaying = useRef<boolean>(false);
  const [hideUi, setHideUi] = useState(false);
  const [length, setLength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(env.IS_PROD ? 0.8 : 0.2);

  const onReady = (reactPlayer: FilePlayerProps) => {
    console.log({ reactPlayer });
    setLength(reactPlayer.getDuration());
  };

  const onProgress = (state: OnProgressProps) => {
    // Optimize and querySelector only once
    setProgress(state.played);
    const bar = sliderRef.current?.querySelector('.mantine-Slider-bar') as HTMLDivElement;
    const thumb = sliderRef.current?.querySelector('.mantine-Slider-thumb') as HTMLDivElement;
    console.log(bar, thumb);

    bar.style.setProperty(
      '--slider-bar-width',
      `calc(${state.played * 100}% + var(--slider-size))`,
    );
    thumb.style.setProperty('--slider-thumb-offset', `${state.played * 100}%`);
    currentTimeText.current = numeral(state.played * length).format('00:00:00');
  };

  const handleSeek = (progressFromSlider: number) => {
    console.log(progressFromSlider);

    ref.current?.seekTo(progressFromSlider);
    startTransition(() => {
      setPlaying(false);
    });
  };

  const setVolumeLimited = (volume: number) => {
    setVolume(Math.max(Math.min(volume, 1), 0));
  };

  const label = length ? numeral(length * progress).format('00:00:00') : '00:00';

  useEffect(() => {
    const onMouseUp = () => {
      if (seekContinuePlaying.current) {
        setPlaying(true);
      }
    };

    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const timeoutRef = useRef<number | null>(null);
  const briefShowUi = (shouldHide = false, immediateHide = false) => {
    setHideUi(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!shouldHide) {
      return;
    }

    if (immediateHide) {
      setHideUi(true);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setHideUi(true);
    }, 700);
  };

  const onClick = () => {
    const newPlaying = !playing;
    setPlaying(newPlaying);
    briefShowUi(newPlaying, true);
  };

  return (
    <div
      className={clsx(css.ReactPlayerWrapper, hideUi && css.hideUi)}
      onClick={onClick}
      onMouseMove={() => briefShowUi(playing)}
      onMouseLeave={() => setHideUi(true)}
    >
      <ReactPlayer
        ref={ref}
        url={url}
        playing={playing}
        volume={volume}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onReady={onReady}
        onProgress={onProgress}
        onEnded={briefShowUi}
        progressInterval={36}
        width="100%"
        height="100%"
        {...other}
      />

      <Slider
        className={css.slider}
        ref={sliderRef}
        // value={progress}
        max={1}
        onChange={handleSeek}
        step={0.001}
        label={label}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          e.stopPropagation();
          seekContinuePlaying.current = playing;
          setPlaying(false);
        }}
      />

      <div className={css.videoOverlayBg} />

      <ActionIcon
        // color="white"
        // variant="light"
        size="xl"
        aria-label="Play"
        // onClick={() => setPlaying(!playing)}
        className={css.playIcon}
      >
        <Icon path={playing ? mdiPause : mdiPlay} size={1} />
      </ActionIcon>

      {!env.IS_PROD && (
        <pre className={css.videoStats} onClick={(e) => e.stopPropagation()}>
          <p>Length: {length}</p>
          <p>Progress: {Math.round(progress * 1000) / 1000}</p>
          <p>Volume: {volume}</p>
          <button onClick={() => setPlaying(!playing)}>Toggle play</button>
          <button onClick={() => setVolumeLimited(volume + 0.1)}>Increase volume</button>
          <button onClick={() => setVolumeLimited(volume - 0.1)}>Decrease volume</button>
        </pre>
      )}
    </div>
  );
};

export default VideoPlayer;
