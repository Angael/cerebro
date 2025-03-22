export interface EndpointStats {
  [endpoint: string]: {
    requests: number;
    statusCodes: { [code: number]: number };
    dailyStats: {
      [date: string]: {
        requests: number;
        statusCodes: { [code: number]: number };
        responseTimes: number[];
      };
    };
    responseTimes: number[];
  };
}

export interface EndpointStatsResponse {
  [endpoint: string]: {
    requests: number;
    statusCodes: { [code: number]: number };
    dailyStats: {
      [date: string]: {
        requests: number;
        statusCodes: { [code: number]: number };
        avgResponseTime: number;
        medianResponseTime: number;
        ninetyPercentile: number;
        ninetyNinePercentile: number;
      };
    };
    avgResponseTime: number;
    medianResponseTime: number;
    ninetyPercentile: number;
    ninetyNinePercentile: number;
  };
}
