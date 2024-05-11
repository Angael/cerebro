import React, { memo } from 'react';

import css from './ItemGrid.module.scss';
import { FrontItem } from '@cerebro/shared';
import ItemThumb from './item-thumb/ItemThumb';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import clsx from 'clsx';

type Props = {
  items: FrontItem[];
  isLoading: boolean;
};

const ItemGrid: React.FunctionComponent<Props> = ({ items, isLoading }) => {
  const [viewMode] = useUrlParam('viewMode');

  return (
    <section className={clsx(css.ItemGrid, css[viewMode])} style={{ opacity: isLoading ? 0.5 : 1 }}>
      {items && items.map((item, i) => <ItemThumb key={item.id} item={item} />)}
    </section>
  );
};

export default memo(ItemGrid);
