import React from 'react';
import { Flex, Pagination as MantinePagination } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';

type Props = {
  page: number;
  pageCount: number;
};

const getHref = (page: number) => `/browse/?pageNr=${page}`;

const Pagination = ({ page, pageCount }: Props) => {
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: 500px)`);
  const md = useMediaQuery(`(max-width: 365px)`);

  return (
    <Flex justify="center">
      <MantinePagination
        size={md ? 'md' : 'lg'}
        siblings={isMobile ? 0 : 2}
        total={pageCount}
        value={page}
        onChange={(page) => router.push(getHref(page))}
      />
    </Flex>
  );
};

export default Pagination;
