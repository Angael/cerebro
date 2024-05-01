import React, { memo } from 'react';
import { Flex, Pagination as MantinePagination } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';

type Props = {
  page: number;
  pageCount: number;
};

const getHref = (page: number) => `/browse/?pageNr=${page}`;

const commonLinkProps = {
  component: Link,
  prefetch: true,
};

const Pagination = ({ page, pageCount }: Props) => {
  const isMobile = useMediaQuery(`(max-width: 500px)`);
  const md = useMediaQuery(`(max-width: 365px)`);

  return (
    <Flex justify="center">
      <MantinePagination
        size={md ? 'md' : 'lg'}
        siblings={isMobile ? 0 : 2}
        total={pageCount}
        value={page}
        getItemProps={(page) => ({
          ...commonLinkProps,
          href: getHref(page),
        })}
        getControlProps={(control) => {
          if (control === 'first') {
            return { ...commonLinkProps, href: getHref(1) };
          }

          if (control === 'last') {
            return { ...commonLinkProps, href: getHref(pageCount) };
          }

          if (control === 'next') {
            return { ...commonLinkProps, href: getHref(page + 1) };
          }

          if (control === 'previous') {
            return { ...commonLinkProps, href: getHref(page - 1) };
          }

          return {};
        }}
      />
    </Flex>
  );
};

export default memo(Pagination);
