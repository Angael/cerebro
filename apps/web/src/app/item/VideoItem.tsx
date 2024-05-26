'use client';
import React, { useState } from 'react';
import type { VideoItem as VideoItemType } from '@cerebro/shared';
import css from './Item.module.scss';
import numeral from 'numeral';
import { Select } from '@mantine/core';
import VideoPlayer from '@/lib/video-player/VideoPlayer';

type Props = {
  item: VideoItemType;
};

const VideoItem = ({ item }: Props) => {
  const placeholder = item.thumbnail;

  const [quality, setQuality] = useState(item.videos.at(-1)!.mediaType);
  const { width, height, bitrateKb, durationMs, src } = item.videos.find(
    (v) => v.mediaType === quality,
  )!;
  const style = {
    backgroundImage: `url(${placeholder})`,
  } as React.CSSProperties;

  const onSelectQuality = (quality: any) => {
    setQuality(quality);
  };

  const bitrate = numeral(bitrateKb * 1000).format('0.00 b');
  const durationStr = numeral(durationMs / 1000).format('00:00:00');
  const sizeStr = numeral(item.videos.find((v) => v.mediaType === quality)?.size ?? 0).format(
    '0.00 b',
  );

  const qualities = item.videos.map((video) => video.mediaType);
  return (
    <div className={css.relativeWrapper}>
      {placeholder && <img src={placeholder} alt="" className={css.blurPlaceholderBg} />}

      <VideoPlayer
        url={src}
        width={width}
        height={height}
        className={css.videoItem}
        qualities={qualities}
        selectedQuality={quality}
        setQuality={onSelectQuality}
        stats={[
          { label: 'Resolution', value: `${width}x${height}` },
          { label: 'Bitrate', value: bitrate },
          { label: 'Duration', value: durationStr },
          { label: 'Size', value: sizeStr },
        ]}
      />
    </div>
  );
};

export default VideoItem;
