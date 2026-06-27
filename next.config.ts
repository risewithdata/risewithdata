import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ← add this line
  images: {
    remotePatterns: [
      { hostname: 'assets.risewithdata.com' },
      { hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;
