export function getPagination(
  page: number,
  pageCount: number,
  shownPagesCount: number,
): number[] {
  const half = Math.floor(shownPagesCount / 2);

  if (pageCount <= shownPagesCount) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  if (page <= half) {
    return Array.from({ length: shownPagesCount }, (_, i) => i + 1);
  }

  if (page >= pageCount - half) {
    return Array.from(
      { length: shownPagesCount },
      (_, i) => pageCount - shownPagesCount + i + 1,
    );
  }

  return Array.from({ length: shownPagesCount }, (_, i) => page - half + i);
}
