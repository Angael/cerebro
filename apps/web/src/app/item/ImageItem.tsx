import React from 'react';
import type { ImageItem as ImageItemType } from '@cerebro/shared';
import css from './Item.module.scss';

type Props = {
  item: ImageItemType;
};

const ImageItem = ({ item }: Props) => {
  const placeholder = item.thumbnail;

  const { width, height, src } = item.images.at(-1)!;
  const style = {
    backgroundImage: `url(${placeholder})`,
  } as React.CSSProperties;

  return (
    <div className={css.Item}>
      {placeholder && <img src={placeholder} alt="" className={css.blurPlaceholderBg} />}
      <img
        className={css.imageItem}
        width={width}
        height={height}
        style={style}
        src={src}
        alt="Viewed uploaded media item"
      />
    </div>
  );
};

export default ImageItem;
