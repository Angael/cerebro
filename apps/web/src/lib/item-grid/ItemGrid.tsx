import React from 'react';

import css from './ItemGrid.module.scss';
import { FrontItem } from '@cerebro/shared';
import ItemThumb from './item-thumb/ItemThumb';

type Props = {
  items: FrontItem[];
  isLoading: boolean;
};

const ItemGrid: React.FunctionComponent<Props> = ({ items, isLoading }) => {
  return (
    <section className={css.ItemGrid} style={{ opacity: isLoading ? 0.5 : 1 }}>
      {items && items.map((item, i) => <ItemThumb key={item.id} item={item} />)}
    </section>
  );
};

export default ItemGrid;
