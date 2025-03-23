import { format, createLogger, transports } from 'winston';
import { env } from '@/utils/env.js';
import * as path from 'path';

const timeAndPrintf = format.combine(
  format.splat(),
  format.timestamp({ format: () => new Date().toISOString() }),
  format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`),
);

export const logger = createLogger({
  level: env.isProd ? 'info' : 'debug',
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), timeAndPrintf),
    }),
    new transports.File({
      filename: path.join(env.LOGS_PATH, 'info.log'),
      level: 'info',
      format: timeAndPrintf,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(env.LOGS_PATH, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

export default logger;
