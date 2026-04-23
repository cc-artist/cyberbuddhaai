/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  assetPrefix: '',
  images: {
    unoptimized: true
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;