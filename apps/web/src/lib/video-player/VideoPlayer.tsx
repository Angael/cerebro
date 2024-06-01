'use client';
import React, { startTransition, SyntheticEvent, useEffect, useRef, useState } from 'react';
import ReactPlayer, { FilePlayerProps } from 'react-player/file';
import { OnProgressProps } from 'react-player/base';
import css from './VideoPlayer.module.scss';
import { ActionIcon, Group, Slider, Text } from '@mantine/core';
import { env } from '@/utils/env';
import numeral from 'numeral';
import Icon from '@mdi/react';
import { mdiFullscreen, mdiPause, mdiPlay } from '@mdi/js';
import clsx from 'clsx';
import VideoVolume from '@/lib/video-player/VideoVolume';
import VideoSettings from '@/lib/video-player/VideoSettings';
import { secToMMSS } from '@/lib/video-player/secToMMSS';
import { useVideoProgressSlider } from '@/lib/video-player/useVideoProgressSlider';
import { useVideoPlayerBasics } from '@/lib/video-player/useVideoPlayerBasics';

type Props = {
  url: string;
  qualities: string[];
  selectedQuality: string;
  setQuality: (quality: string) => void;
  stats: { label: string; value: string }[];
} & React.ComponentProps<typeof ReactPlayer>;

const VideoPlayer = ({
  url,
  width,
  height,
  qualities,
  selectedQuality,
  setQuality,
  stats,
  ...other
}: Props) => {
  const isSeeking = useRef<boolean>(false);
  const seekContinuePlaying = useRef<boolean>(false);
  const [hideUi, setHideUi] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(env.IS_PROD ? 0.8 : 0.2);

  const { sliderRef, setSliderProgress } = useVideoProgressSlider();
  const { reactPlayerRef, length, progress, onReady, onProgress, onFullScreen } =
    useVideoPlayerBasics({ setSliderProgress });

  const handleSeek = (progressFromSlider: number) => {
    isSeeking.current = true;
    reactPlayerRef.current?.seekTo(progressFromSlider, 'fraction');
    startTransition(() => {
      setPlaying(false);
      briefShowUi(playing, false);
    });
  };

  const setVolumeLimited = (volume: number) => {
    setVolume(Math.max(Math.min(volume, 1), 0));
  };

  const label = secToMMSS(length ? length * progress : 0);

  useEffect(() => {
    const onMouseUp = (e: any) => {
      console.log('onMouseUp', e.type, seekContinuePlaying.current);
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

  const timeoutRef = useRef<number | null>(null);
  const briefShowUi = (shouldHide = false, immediateHide = false, hideTimeoutMs = 800) => {
    setHideUi(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!shouldHide || isSeeking.current) {
      return;
    }

    if (immediateHide) {
      setHideUi(true);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setHideUi(true);
    }, hideTimeoutMs);
  };

  const onClick = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.nativeEvent.pointerType === 'touch') {
      // TODO: Here, if UI is visible, hide it
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

  return (
    <div
      className={clsx(css.ReactPlayerWrapper, hideUi && css.hideUi)}
      onClick={onClick}
      onMouseMove={() => briefShowUi(playing)}
      onMouseLeave={() => setHideUi(true)}
      onDoubleClick={onFullScreen}
      style={{ aspectRatio: `${width}/${height}`, width: '100%' }}
    >
      <ReactPlayer
        ref={reactPlayerRef}
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

      <ActionIcon
        color="white"
        variant="default"
        size="70px"
        aria-label={playing ? 'Pause' : 'Play'}
        className={css.playIcon}
        onClick={onPlay}
      >
        <Icon path={playing ? mdiPause : mdiPlay} size={3} />
      </ActionIcon>

      <div className={css.sliderBar}>
        <Text
          c="white"
          size="xs"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className={css.length}
        >
          {label} / {secToMMSS(length)}
        </Text>

        <Slider
          size="lg"
          className={css.slider}
          ref={sliderRef}
          color="white"
          max={1}
          onChange={handleSeek}
          step={0.001}
          label={label}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={handleSliderPointerStartEvent}
          onTouchStart={handleSliderPointerStartEvent}
          style={{ flex: 1 }}
        />

        <Group className={css.settings}>
          <VideoVolume volume={volume} setVolume={setVolumeLimited} />

          <VideoSettings
            qualities={qualities}
            selectedQuality={selectedQuality}
            setQuality={setQuality}
            stats={stats}
          />

          <ActionIcon
            variant="light"
            color="white"
            size="sm"
            aria-label="Full Screen"
            onClick={(e) => {
              e.stopPropagation();
              onFullScreen();
            }}
          >
            <Icon path={mdiFullscreen} size={1} />
          </ActionIcon>
        </Group>
      </div>

      <div className={css.videoOverlayBg} />
    </div>
  );
};

export default VideoPlayer;
