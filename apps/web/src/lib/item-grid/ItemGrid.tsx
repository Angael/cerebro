import React from "react";

import css from "./ItemGrid.module.scss";
import { FrontItem } from "@vanih/cerebro-contracts";
import ItemThumb from "./item-thumb/ItemThumb";

type Props = {
  items: FrontItem[];
};

const ItemGrid: React.FunctionComponent<Props> = ({ items }) => {
  return (
    <section className={css.ItemGrid}>
      {items && items.map((item, i) => <ItemThumb key={item.id} item={item} />)}
    </section>
  );
};

export default ItemGrid;
