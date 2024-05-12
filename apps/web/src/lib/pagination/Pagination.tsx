'use client';
import React, { memo } from 'react';
import { Flex, Pagination as MantinePagination } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';

type Props = {
  page: number;
  createQueryString: (page: `${number}`) => string;
  pageCount: number;
};

const Pagination = ({ page, createQueryString, pageCount }: Props) => {
  const isMobile = useMediaQuery(`(max-width: 600px)`);
  const isVerySmall = useMediaQuery(`(max-width: 380px)`);

  const getProps = (page: number) => {
    if (page < 1) return {};
    if (page > pageCount) return {};
    return { component: Link, prefetch: true, href: `/browse/?` + createQueryString(`${page}`) };
  };

  return (
    <Flex justify="center">
      <MantinePagination
        size={isVerySmall ? 'md' : 'lg'}
        boundaries={isMobile ? 0 : 1}
        siblings={isMobile ? 0 : 1}
        total={pageCount}
        value={page}
        getItemProps={(page) => getProps(page)}
        getControlProps={(control) => {
          switch (control) {
            case 'first':
              return getProps(1);
            case 'last':
              return getProps(pageCount);
            case 'next':
              return getProps(page + 1);
            case 'previous':
              return getProps(page - 1);
            default:
              return {};
          }
        }}
      />
    </Flex>
  );
};

export default memo(Pagination);
