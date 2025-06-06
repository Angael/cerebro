import { Context, Next } from 'hono';
import { EndpointStats, EndpointStatsResponse } from './server-stats.model';
import logger from '@/utils/log';
import { loadStats, saveStats } from './stats-persistance';
import { env } from '@/utils/env';
import { subDays } from 'date-fns';

export const endpointStats: EndpointStats = await loadStats();

export async function statsMiddleware(c: Context, next: Next) {
  const start = performance.now();
  await next();
  const end = performance.now();
  const responseTime = end - start;

  const endpoint = c.req.routePath;
  const statusCode = c.res.status;
  const now = new Date();
  const dateString = now.toISOString().split('T')[0]!; // YYYY-MM-DD

  if (!endpointStats[endpoint]) {
    endpointStats[endpoint] = {
      requests: 0,
      statusCodes: {},
      dailyStats: {},
      responseTimes: [],
    };
  }

  endpointStats[endpoint].requests++;
  endpointStats[endpoint].responseTimes.push(Math.round(responseTime));

  if (!endpointStats[endpoint].statusCodes[statusCode]) {
    endpointStats[endpoint].statusCodes[statusCode] = 0;
  }
  endpointStats[endpoint].statusCodes[statusCode]++;

  if (!endpointStats[endpoint].dailyStats[dateString]) {
    endpointStats[endpoint].dailyStats[dateString] = {
      requests: 0,
      statusCodes: {},
      responseTimes: [],
    };
  }

  const dailyStats = endpointStats[endpoint].dailyStats[dateString];
  dailyStats.requests++;
  dailyStats.responseTimes.push(Math.round(responseTime));

  if (!dailyStats.statusCodes[statusCode]) {
    dailyStats.statusCodes[statusCode] = 0;
  }
  dailyStats.statusCodes[statusCode]++;
}

function calculatePercentile(data: number[], percentile: number): number {
  const sortedData = data.slice().sort((a, b) => a - b);
  const index = (percentile / 100) * (sortedData.length - 1);

  if (Number.isInteger(index)) {
    return Math.round(sortedData[index]!);
  } else {
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const fraction = index - lowerIndex;
    return Math.round(
      sortedData[lowerIndex]! * (1 - fraction) + sortedData[upperIndex]! * fraction,
    );
  }
}

function calculateAverage(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / data.length);
}

function calculateMedian(data: number[]): number {
  const sortedData = data.slice().sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  return Math.round(
    sortedData.length % 2 !== 0 ? sortedData[mid]! : (sortedData[mid - 1]! + sortedData[mid]!) / 2,
  );
}

export const getStats = (): EndpointStatsResponse => {
  const statsResponse: EndpointStatsResponse = {};

  for (const endpoint in endpointStats) {
    if (endpoint in endpointStats) {
      const endpointData = endpointStats[endpoint]!;
      const allResponseTimes = endpointData.responseTimes;

      const avgResponseTime = calculateAverage(allResponseTimes);
      const medianResponseTime = calculateMedian(allResponseTimes);
      const ninetyPercentile = calculatePercentile(allResponseTimes, 90);
      const ninetyNinePercentile = calculatePercentile(allResponseTimes, 99);

      statsResponse[endpoint] = {
        requests: endpointData.requests,
        statusCodes: endpointData.statusCodes,
        avgResponseTime: avgResponseTime,
        medianResponseTime: medianResponseTime,
        ninetyPercentile: ninetyPercentile,
        ninetyNinePercentile: ninetyNinePercentile,
        dailyStats: {},
      };

      for (const date in endpointData.dailyStats) {
        if (date in endpointData.dailyStats) {
          const dailyData = endpointData.dailyStats[date]!;
          const dailyAvgResponseTime = calculateAverage(dailyData.responseTimes);
          const dailyMedianResponseTime = calculateMedian(dailyData.responseTimes);
          const dailyNinetyPercentile = calculatePercentile(dailyData.responseTimes, 90);
          const dailyNinetyNinePercentile = calculatePercentile(dailyData.responseTimes, 99);

          statsResponse[endpoint].dailyStats[date] = {
            requests: dailyData.requests,
            statusCodes: dailyData.statusCodes,
            avgResponseTime: dailyAvgResponseTime,
            medianResponseTime: dailyMedianResponseTime,
            ninetyPercentile: dailyNinetyPercentile,
            ninetyNinePercentile: dailyNinetyNinePercentile,
          };
        }
      }
    }
  }

  return statsResponse;
};

// Deletes stats older than 7 days
const deleteOldStats = () => {
  logger.info('Deleting old stats');
  const now = new Date();
  const cutoffDate = subDays(now, 7);
  const cutoffDateString = cutoffDate.toISOString().split('T')[0]!; // YYYY-MM-DD

  for (const endpoint in endpointStats) {
    if (endpoint in endpointStats) {
      const endpointData = endpointStats[endpoint]!;
      for (const date in endpointData.dailyStats) {
        if (date < cutoffDateString) {
          delete endpointData.dailyStats[date];
        }
      }
    }
  }

  saveStats(endpointStats);
};

const minute = 1000 * 60;
const hour = minute * 60;
setInterval(() => saveStats(endpointStats), env.isProd ? hour : minute * 10);
setInterval(deleteOldStats, hour * 24); // Every 24 hours
