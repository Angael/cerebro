import type { FrontItem } from '@cerebro/shared';
import { MD_CELL_SIZE } from '@/utils/consts';

const getWH = (item: FrontItem): { w: number; h: number } => {
  if (item.type === 'VIDEO') {
    const { width: w, height: h } = item.videos.find((v) => v.mediaType === 'SOURCE')!;
    return { w, h };
  }
  if (item.type === 'IMAGE') {
    const { width: w, height: h } = item.images.find((i) => i.mediaType === 'SOURCE')!;
    return { w, h };
  }
  return { w: 0, h: 0 };
};

export const getGridSpan = (item: FrontItem): '' | 'tall' | 'wide' => {
  const { w, h } = getWH(item);

  if (!h || !w) {
    return '';
  }
  const howWide = w / h;

  if (howWide >= 1.35 && w >= 2 * MD_CELL_SIZE && h >= MD_CELL_SIZE) {
    return 'wide';
  } else if (howWide <= 0.75 && w >= MD_CELL_SIZE && h >= 2 * MD_CELL_SIZE) {
    return 'tall';
  } else {
    return '';
  }
};
