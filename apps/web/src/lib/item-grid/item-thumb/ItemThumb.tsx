import React, { useState } from 'react';

import css from './ItemThumb.module.scss';
import { getGridSpan, getMasonryRowSpan } from './getGridSpan';
import { mdiAlertCircleOutline, mdiClockOutline, mdiEyeOff } from '@mdi/js';
import { Icon } from '@mdi/react';
import { FrontItem } from '@cerebro/shared';
import clsx from 'clsx';
import Link from 'next/link';
import { Paper } from '@mantine/core';

interface IProps {
  item: FrontItem;
  selfSetRowSpan: boolean;
}

const ItemThumb = ({ item, selfSetRowSpan }: IProps) => {
  const [isThumbnailError, setIsThumbnailError] = useState(false);
  const thumbnailSrc = item.thumbnail ?? item.icon ?? '';
  const gridSpanClass = getGridSpan(item);

  const style = selfSetRowSpan ? { gridRow: 'auto/span ' + getMasonryRowSpan(item) } : {};

  const thumbContainerStyle = selfSetRowSpan
    ? {
        margin: 8,
        borderRadius: 8,
        overflow: 'hidden',
        height: 'calc(100% - 16px)',
        width: 'calc(100% - 16px)',
      }
    : {};

  return (
    <Link
      href={`/item?itemId=${item.id}`}
      className={clsx(css.itemBtn, gridSpanClass)}
      style={style}
      data-testId="item"
    >
      {item.private && <Icon path={mdiEyeOff} size={1} className={css.private} />}
      <div className={css.thumbnailContainer} style={thumbContainerStyle}>
        {isThumbnailError && (
          <Paper className={css.centerContainer} style={{ textAlign: 'center' }}>
            <Icon path={mdiAlertCircleOutline} size={2} color={'white'} />
            <p>Thumbnail error</p>
          </Paper>
        )}

        {!isThumbnailError && !thumbnailSrc ? (
          <div className={css.centerContainer} style={{ backgroundColor: 'grey' }}>
            <Icon path={mdiClockOutline} size={2} color={'white'} />
            <p>Thumbnail not ready...</p>
          </div>
        ) : (
          <img
            alt={'item ' + item.id}
            src={thumbnailSrc}
            className={clsx(css.thumbnail)}
            onError={() => setIsThumbnailError(true)}
          />
        )}
      </div>
    </Link>
  );
};

export default ItemThumb;
