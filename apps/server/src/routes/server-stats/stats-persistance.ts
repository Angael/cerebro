import { env } from '@/utils/env';
import { EndpointStats } from './server-stats.model';
import * as path from 'path';
import logger from '@/utils/log';

const statsFile = path.join(env.LOGS_PATH, 'stats.json');

export const loadStats = async (): Promise<EndpointStats> => {
  try {
    const fileContents = await Bun.file(statsFile).text();
    logger.info('Loaded stats', fileContents);
    return JSON.parse(fileContents);
  } catch (error) {
    logger.error('Failed to load stats from file, %s', error);
    return {};
  }
};

export const saveStats = async (stats: EndpointStats): Promise<void> => {
  try {
    await Bun.write(statsFile, JSON.stringify(stats));
    logger.info('Saved stats to %s', statsFile);
  } catch (error) {
    logger.error('Failed to save stats to file, %s', error);
  }
};
