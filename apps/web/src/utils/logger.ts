import * as Sentry from '@sentry/nextjs';
import { clientEnv } from './clientEnv';

export class Logger {
  static verbose(where: string, ...args: any[]) {
    if (!clientEnv.IS_PROD) {
      // Yellow color for VERBOSE
      console.log(`\x1b[33mVERBOSE\x1b[0m [${where}]`, ...args);
    }
  }

  static info(where: string, ...args: any[]) {
    // Blue color for INFO
    console.info(`\x1b[34mINFO\x1b[0m [${where}]`, ...args);
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
    // Red color for ERROR
    console.error(`\x1b[31mERROR\x1b[0m [${where}]`, newError);
  }
}
