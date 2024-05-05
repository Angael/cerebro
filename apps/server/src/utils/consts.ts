export const MB = 1024 * 1024;
export const GB = 1024 * 1024 * 1024;

export const MD_CELL_SIZE = 300;
export const XS_CELL_SIZE = 32;

/** Maximum size in MB */
export const MAX_UPLOAD_SIZE = 30 * MB;
export const TEMP_DIR = '_temp';
export const UPLOADS_DIR = '_temp/file-uploads';
export const DOWNLOADS_DIR = '_temp/downloads';
export const THUMBNAILS_DIR = '_temp/thumbnails';
export const OPTIMIZATION_DIR = '_temp/optimization';

export const STRIPE_ACCESS_PLAN_PRODUCT = {
  id: 'product-cerebro-access',
  name: 'Cerebro Access',
  description: 'Get access to Cerebro platform.',
} as const;
export const STRIPE_ACCESS_PLAN_PRICE = {
  product: STRIPE_ACCESS_PLAN_PRODUCT.id,
  unit_amount: 1000, // 10PLN
  currency: 'pln',
  recurring: { interval: 'month' }, // Subscription interval
} as const;
