import { Context, Next } from 'hono';

interface EndpointStats {
  [endpoint: string]: {
    requests: number;
    statusCodes: { [code: number]: number };
    totalResponseTime: number;
  };
}

const endpointStats: EndpointStats = {};

export async function statsMiddleware(c: Context, next: Next) {
  const start = performance.now();
  await next();
  const end = performance.now();
  const responseTime = end - start;

  const endpoint = c.req.routePath; // Or use c.req.routePath if you have defined routes with parameters.
  const statusCode = c.res.status;

  if (!endpointStats[endpoint]) {
    endpointStats[endpoint] = {
      requests: 0,
      statusCodes: {},
      totalResponseTime: 0,
    };
  }

  endpointStats[endpoint].requests++;
  endpointStats[endpoint].totalResponseTime += responseTime;

  if (!endpointStats[endpoint].statusCodes[statusCode]) {
    endpointStats[endpoint].statusCodes[statusCode] = 0;
  }
  endpointStats[endpoint].statusCodes[statusCode]++;
}

export function getStats() {
  const stats: { [key: string]: any } = {};
  for (const endpoint in endpointStats) {
    const endpointStat = endpointStats[endpoint];
    if (endpointStat) {
      stats[endpoint] = {
        requests: endpointStat.requests,
        statusCodes: endpointStat.statusCodes,
        avgResponseTime: endpointStat.totalResponseTime / endpointStat.requests,
      };
    }
  }
  return stats;
}
