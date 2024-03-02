import { PrismaClient } from '@cerebro/db';
import logger from '../utils/log.js';

export const prisma = new PrismaClient();

prisma.$on('beforeExit', () => {
  logger.error('Prisma shutdown');

  process.exitCode = 1;
  process.exit();
});
