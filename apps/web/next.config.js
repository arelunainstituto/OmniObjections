/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@omni/types', '@omni/db'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;

