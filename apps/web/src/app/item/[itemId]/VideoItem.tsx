'use client';
import React, { useState } from 'react';
import type { VideoItem as VideoItemType } from '@cerebro/shared';
import css from './Item.module.scss';

type Props = {
  item: VideoItemType;
};

const VideoItem = ({ item }: Props) => {
  const placeholder = item.thumbnail;

  const [quality, setQuality] = useState('source');
  const { width, height, bitrateKb, durationMs, src } = item.video;
  const style = {
    backgroundImage: `url(${placeholder})`,
  } as React.CSSProperties;

  const onSelectQuality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quality = e.target.value;

    setQuality(quality);
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
      <select onChange={onSelectQuality} value={quality}>
        <option value="source">Source</option>
        <option value="optimized">Optimized</option>
      </select>
    </div>
  );
};

export default VideoItem;
