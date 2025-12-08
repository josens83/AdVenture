/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@adventure/shared'],
  images: {
    domains: ['localhost', 'adventure-game.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
