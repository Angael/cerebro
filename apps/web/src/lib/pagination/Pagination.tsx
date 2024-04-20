import React from 'react';
import { Flex, Pagination as MantinePagination } from '@mantine/core';
import { useRouter } from 'next/navigation';

type Props = {
  page: number;
  pageCount: number;
};

const getHref = (page: number) => `/browse/?pageNr=${page}`;

const Pagination = ({ page, pageCount }: Props) => {
  const router = useRouter();

  return (
    <Flex justify="center">
      <MantinePagination
        siblings={2}
        total={pageCount}
        value={page}
        onChange={(page) => router.push(getHref(page))}
        withEdges
      />
    </Flex>
  );
};

export default Pagination;
