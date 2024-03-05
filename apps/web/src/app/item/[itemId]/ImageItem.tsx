import React from 'react';
import type { ImageItem as ImageItemType } from '@vanih/cerebro-contracts';
import css from './Item.module.scss';

type Props = {
  item: ImageItemType;
};

const ImageItem = ({ item }: Props) => {
  const placeholder = item.thumbnail;

  const { width, height } = item.image;
  const style = {
    backgroundImage: `url(${placeholder})`,
  } as React.CSSProperties;

  return (
    <div className={css.container}>
      <img
        width={width}
        height={height}
        style={style}
        src={item.image.src}
        alt="Viewed uploaded media item"
      />
    </div>
  );
};

export default ImageItem;
