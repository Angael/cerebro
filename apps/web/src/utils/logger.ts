import * as Sentry from '@sentry/nextjs';
import { env } from './env';

export class Logger {
  static verbose(where: string, ...args: any[]) {
    if (!env.IS_PROD) {
      console.log(`VERBOSE [${where}]`, ...args);
    }
  }

  static info(where: string, ...args: any[]) {
    console.info(`INFO [${where}]`, ...args);
  }

  static error(where: string, error: Error | string) {
    const newError = new Error();

    if (error instanceof Error) {
      newError.name = `[${where}] ${error.name}`;

      for (const key of Object.getOwnPropertyNames(error)) {
        if (key !== 'name') {
          // @ts-ignore
          newError[key] = error[key];
        }
      }
    } else {
      newError.name = `[${where}] ${error}`;
    }

    Sentry.captureException(newError);
    console.error(newError);
  }
}
