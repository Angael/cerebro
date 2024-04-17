/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    missingSuspenseWithCSRBailout: false, // makes no sense to use this with export
  },
};

module.exports = nextConfig;
