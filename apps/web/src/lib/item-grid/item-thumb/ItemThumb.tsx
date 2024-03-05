import React from 'react';

import css from './ItemThumb.module.scss';
import { getGridSpan } from './getGridSpan';
import { mdiClockOutline, mdiEyeOff } from '@mdi/js';
import { Icon } from '@mdi/react';
import { FrontItem } from '@cerebro/shared';
import clsx from 'clsx';
import Link from 'next/link';

interface IProps {
  item: FrontItem;
}

const ItemThumb = ({ item }: IProps) => {
  const thumbnailSrc = item.thumbnail ?? item.icon ?? '';
  const gridSpanClass = getGridSpan(item);

  return (
    <Link href={`/item/${item.id}`} className={clsx(css.itemBtn, gridSpanClass)}>
      {item.private && <Icon path={mdiEyeOff} size={1} className={css.private} />}
      <div className={css.thumbnailContainer}>
        {!thumbnailSrc ? (
          <div className={css.centerContainer} style={{ backgroundColor: 'grey' }}>
            <Icon path={mdiClockOutline} size={2} color={'white'} />
            <p>Thumbnail not ready...</p>
          </div>
        ) : (
          <img alt={'item ' + item.id} src={thumbnailSrc} className={clsx(css.thumbnail)} />
        )}
      </div>
    </Link>
  );
};

export default ItemThumb;
