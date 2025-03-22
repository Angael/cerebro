import { Context, Next } from 'hono';
import { EndpointStats, EndpointStatsResponse } from './server-stats.model';

export const endpointStats: EndpointStats = {};

export async function statsMiddleware(c: Context, next: Next) {
  const start = performance.now();
  await next();
  const end = performance.now();
  const responseTime = end - start;

  const endpoint = c.req.routePath; // Or use c.req.routePath if you have defined routes with parameters.
  const statusCode = c.res.status;
  const now = new Date();
  const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD

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
    return sortedData[index];
  } else {
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const fraction = index - lowerIndex;
    return sortedData[lowerIndex] * (1 - fraction) + sortedData[upperIndex] * fraction;
  }
}

function calculateAverage(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
}

function calculateMedian(data: number[]): number {
  const sortedData = data.slice().sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  return sortedData.length % 2 !== 0
    ? sortedData[mid]
    : (sortedData[mid - 1] + sortedData[mid]) / 2;
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
