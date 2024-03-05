import { PrismaClient } from '@cerebro/db';
import logger from '@/utils/log.js';

export const prisma = new PrismaClient();

prisma.$on('error' as never, (e) => {
  logger.error(e);
});
