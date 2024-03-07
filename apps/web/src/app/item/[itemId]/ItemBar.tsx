'use client';

import React from 'react';
import { Btn } from '@/styled/btn/Btn';
import { useRouter } from 'next/navigation';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import Link from 'next/link';

type Props = {};

const ItemBar = (props: Props) => {
  const router = useRouter();

  return (
    <div className="flex gap-1 wrap">
      <Link
        href="/browse"
        onClick={router.back}
        className="flex center"
        style={{ marginRight: 'auto' }}
      >
        <Icon path={mdiArrowLeft} size={0.8} />
        Go back
      </Link>

      <Btn>Download</Btn>
      <Btn>Share</Btn>
      <Btn>Delete</Btn>
    </div>
  );
};

export default ItemBar;
