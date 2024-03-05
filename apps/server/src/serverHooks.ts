import logger from '@/utils/log.js';

process.on('beforeExit', () => {
  logger.info('Server is shutting down');
});

process.on('exit', () => {
  logger.info('Server is shut down');
});

process.on('uncaughtException', (e) => {
  logger.error('Uncaught exception:', e);
});
