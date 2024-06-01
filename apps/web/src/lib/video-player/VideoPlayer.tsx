'use client';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player/file';
import css from './VideoPlayer.module.scss';
import { ActionIcon, Group, Slider, Text } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiFullscreen, mdiPause, mdiPlay } from '@mdi/js';
import clsx from 'clsx';
import VideoVolume from '@/lib/video-player/VideoVolume';
import VideoSettings from '@/lib/video-player/VideoSettings';
import { secToMMSS } from '@/lib/video-player/secToMMSS';
import { useVideoPlayerBasics } from '@/lib/video-player/useVideoPlayerBasics';
import { useVideoPlay } from '@/lib/video-player/useVideoPlay';
import { useHideVideoUi } from '@/lib/video-player/useHideVideoUi';

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
  const [playing, setPlaying] = useState(false);
  const isSeeking = useRef<boolean>(false);

  const {
    reactPlayerRef,
    sliderRef,
    length,
    progress,
    volume,
    setVolumeLimited,
    onReady,
    onProgress,
    onFullScreen,
  } = useVideoPlayerBasics();

  const { hideUi, briefShowUi } = useHideVideoUi({
    isSeeking,
  });

  const { handleSliderPointerStartEvent, handleSeek, onPlay, onClick } = useVideoPlay({
    reactPlayerRef,
    isSeeking,
    playing,
    setPlaying,
    briefShowUi,
  });

  const label = secToMMSS(length ? length * progress : 0);

  return (
    <div
      className={clsx(css.ReactPlayerWrapper, hideUi && css.hideUi)}
      onClick={onClick}
      onMouseMove={() => briefShowUi(playing)}
      onMouseLeave={() => briefShowUi(true, true)}
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
