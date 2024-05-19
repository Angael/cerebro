'use client';
import React, { useState } from 'react';
import type { VideoItem as VideoItemType } from '@cerebro/shared';
import css from './Item.module.scss';
import numeral from 'numeral';
import { Select } from '@mantine/core';

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
    <>
      <div className={css.relativeWrapper}>
        {placeholder && <img src={placeholder} alt="" className={css.blurPlaceholderBg} />}

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
      </div>

      <div className={css.videoStats} style={{ marginLeft: 'auto' }}>
        <p>
          Resolution: {width}x{height}
        </p>
        <p>Bitrate: {bitrate}/s</p>
        <p>Duration: {durationStr}</p>
        <p>Size: {sizeStr}</p>
        <Select data={qualities} value={quality} onChange={onSelectQuality} />
      </div>
    </>
  );
};

export default VideoItem;
