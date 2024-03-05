import React from 'react';
import { BtnLink } from '@/styled/btn/Btn';
import css from './Pagination.module.scss';
import { getPagination } from './getPagination';
import Link from 'next/link';

type Props = {
  page: number;
  pageCount: number;
};

const getHref = (page: number) => `/browse?page=${page}`;

const Pagination = ({ page, pageCount }: Props) => {
  const canGoBack = page > 1;
  const canGoForward = page < pageCount;

  const shownButtons = getPagination(page, pageCount, 11);

  return (
    <nav className={css.paginationStack}>
      <BtnLink href={getHref(page - 1)} aria-disabled={!canGoBack}>
        Back
      </BtnLink>

      <div className={css.pages}>
        {shownButtons.map((nr) => (
          <Link className={css.pageLink} key={nr} href={getHref(nr)} aria-disabled={page === nr}>
            {nr}
          </Link>
        ))}
      </div>

      <BtnLink aria-disabled={!canGoForward} href={getHref(page + 1)}>
        Next
      </BtnLink>
    </nav>
  );
};

export default Pagination;
