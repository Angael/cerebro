'use client';
import React, { useState } from 'react';
import type { VideoItem as VideoItemType } from '@cerebro/shared';
import css from './Item.module.scss';

type Props = {
  item: VideoItemType;
};

const VideoItem = ({ item }: Props) => {
  const placeholder = item.thumbnail;

  const [quality, setQuality] = useState(item.videos[0].mediaType);
  const { width, height, bitrateKb, durationMs, src } = item.videos.find(
    (v) => v.mediaType === quality,
  )!;
  const style = {
    backgroundImage: `url(${placeholder})`,
  } as React.CSSProperties;

  const onSelectQuality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quality = e.target.value;

    setQuality(quality as any);
  };

  return (
    <div className={css.container}>
      <video
        width={width}
        height={height}
        key={src}
        controls
        poster={item.thumbnail || ''}
        autoPlay
        loop
        style={style}
        className={css.videoItem}
      >
        <source src={src} />
      </video>
      <p>Bitrate: {bitrateKb}kbps</p>
      <p>Duration: {durationMs}ms</p>
      <select onChange={onSelectQuality} value={quality}>
        {item.videos.map((video) => (
          <option key={video.mediaType} value={video.mediaType}>
            {video.mediaType}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VideoItem;
