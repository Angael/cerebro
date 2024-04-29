import React, { useState } from 'react';

import css from './ItemThumb.module.scss';
import { getGridSpan } from './getGridSpan';
import { mdiAlertCircleOutline, mdiClockOutline, mdiEyeOff } from '@mdi/js';
import { Icon } from '@mdi/react';
import { FrontItem } from '@cerebro/shared';
import clsx from 'clsx';
import Link from 'next/link';
import { Paper } from '@mantine/core';

interface IProps {
  item: FrontItem;
}

const ItemThumb = ({ item }: IProps) => {
  const [isThumbnailError, setIsThumbnailError] = useState(false);
  const thumbnailSrc = item.thumbnail ?? item.icon ?? '';
  const gridSpanClass = getGridSpan(item);

  return (
    <Link href={`/item?itemId=${item.id}`} className={clsx(css.itemBtn, gridSpanClass)}>
      {item.private && <Icon path={mdiEyeOff} size={1} className={css.private} />}
      <div className={css.thumbnailContainer}>
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
