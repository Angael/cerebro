'use client';
import React, { useRef, useState } from 'react';
import ReactPlayer, { FilePlayerProps } from 'react-player/file';
import css from './VideoPlayer.module.scss';
import { ActionIcon, Group, Loader, Slider, Text } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiFullscreen, mdiLoading, mdiPause, mdiPlay } from '@mdi/js';
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
  className,
  style,
  ...other
}: Props) => {
  const [playing, setPlaying] = useState(true);
  const isSeeking = useRef<boolean>(false);

  const {
    isBuffering,
    setIsBuffering,
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

  const { hideUi, briefShowUi, setHideVideoUi } = useHideVideoUi({
    isSeeking,
  });

  const { handleSliderPointerStartEvent, handleSeek, onClickPlayIcon, onClickVideo } = useVideoPlay(
    {
      reactPlayerRef,
      isSeeking,
      playing,
      setPlaying,
      briefShowUi,
    },
  );

  const label = secToMMSS(length ? length * progress : 0);

  return (
    <div
      className={clsx(css.ReactPlayerWrapper, hideUi && css.hideUi, className)}
      onClick={onClickVideo}
      onMouseMove={() => briefShowUi(playing)}
      onMouseLeave={() => setHideVideoUi()}
      onDoubleClick={onFullScreen}
      style={style}
    >
      <ReactPlayer
        className={css.videoPlayer}
        ref={reactPlayerRef}
        url={url}
        playing={playing}
        volume={volume}
        onPlay={() => {
          setPlaying(true);
          setHideVideoUi(500);
        }}
        onPause={() => setPlaying(false)}
        onReady={onReady}
        onProgress={onProgress}
        onEnded={briefShowUi}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        progressInterval={36}
        width="100%"
        height="100%"
        {...other}
      />

      {isBuffering ? (
        <div className={css.buffering}>
          <Loader size={48} type="bars" color="white" />
        </div>
      ) : (
        <ActionIcon
          color="white"
          variant="default"
          size="70px"
          aria-label={playing ? 'Pause' : 'Play'}
          className={css.playIcon}
          onClick={onClickPlayIcon}
        >
          <Icon path={playing ? mdiPause : mdiPlay} size={3} />
        </ActionIcon>
      )}

      <div className={css.sliderBar}>
        <Text
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className={css.length}
          c="white"
          size="xs"
        >
          {label} / {secToMMSS(length)}
        </Text>

        <Slider
          ref={sliderRef}
          max={1}
          onChange={handleSeek}
          step={0.001}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={handleSliderPointerStartEvent}
          onTouchStart={handleSliderPointerStartEvent}
          label={label}
          color="white"
          size="lg"
          className={css.slider}
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
            onClick={(e) => {
              e.stopPropagation();
              onFullScreen();
            }}
            variant="light"
            color="white"
            size="sm"
            aria-label="Full Screen"
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
