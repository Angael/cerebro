/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    useCache: true,
    ppr: true,
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(module.exports, {
  org: 'krzysztof-widacki',
  project: 'cerebro-next',
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
