import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'assets.risewithdata.com' },
      { hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;
