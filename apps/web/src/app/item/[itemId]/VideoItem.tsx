import React from 'react';
import type { VideoItem as VideoItemType } from '@cerebro/shared';
import css from './Item.module.scss';

type Props = {
  item: VideoItemType;
};

const VideoItem = ({ item }: Props) => {
  const placeholder = item.thumbnail;

  const { width, height, bitrateKb, durationMs, src } = item.video;
  const style = {
    backgroundImage: `url(${placeholder})`,
  } as React.CSSProperties;

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
    </div>
  );
};

export default VideoItem;
