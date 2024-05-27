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
    setLength(reactPlayer.getDuration());
  };

  const onProgress = (state: OnProgressProps) => {
    // Optimize and querySelector only once
    setProgress(state.played);
    const bar = sliderRef.current?.querySelector('.mantine-Slider-bar') as HTMLDivElement;
    const thumb = sliderRef.current?.querySelector('.mantine-Slider-thumb') as HTMLDivElement;

    bar.style.setProperty(
      '--slider-bar-width',
      `calc(${state.played * 100}% + var(--slider-size))`,
    );
    thumb.style.setProperty('--slider-thumb-offset', `${state.played * 100}%`);
    currentTimeText.current = numeral(state.played * length).format('00:00:00');
  };

  const handleSeek = (progressFromSlider: number) => {
    ref.current?.seekTo(progressFromSlider);
    startTransition(() => {
      setPlaying(false);
    });
  };

  const setVolumeLimited = (volume: number) => {
    setVolume(Math.max(Math.min(volume, 1), 0));
  };

  const label = secToMMSS(length ? length * progress : 0);

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
  const briefShowUi = (shouldHide = false, immediateHide = false, hideTimeoutMs = 800) => {
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
    const newPlaying = !playing;
    setPlaying(newPlaying);
    briefShowUi(newPlaying, true);
  };

  const onFullScreen = () => {
    const player = ref.current?.getInternalPlayer();
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

      <Group className={css.sliderBar}>
        <Text c="white" size="xs">
          {label} / {secToMMSS(length)}
        </Text>

        <Slider
          ref={sliderRef}
          color="white"
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
          style={{ flex: 1 }}
        />

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

      <div className={css.videoOverlayBg} />
    </div>
  );
};

export default VideoPlayer;
