import { Suspense } from 'react';
import Item from './Item';

const ItemPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Item />
    </Suspense>
  );
};

export default ItemPage;
