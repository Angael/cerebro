import { stripe } from '../my-stripe.js';
import { STRIPE_ACCESS_PLAN_PRICE, STRIPE_ACCESS_PLAN_PRODUCT } from '@/utils/consts.js';
import logger from '@/utils/log.js';

const stripeSetup = async () => {
  let product = await stripe.products.retrieve(STRIPE_ACCESS_PLAN_PRODUCT.id).catch((e) => null);

  if (!product) {
    const product = await stripe.products.create(STRIPE_ACCESS_PLAN_PRODUCT);
    logger.info('Created product %s ', product.id);

    const price = await stripe.prices.create({
      ...STRIPE_ACCESS_PLAN_PRICE,
      active: true,
    });
    logger.info('Created price %s', price.id);
  } else {
    logger.info('Product and price already exists, skipping creation');
  }
};

export default stripeSetup;
