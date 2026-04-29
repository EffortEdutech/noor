/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@noor/ui',
    '@noor/data',
    '@noor/content',
    '@noor/search',
    '@noor/config'
  ]
};

export default nextConfig;
