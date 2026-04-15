/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  images: {
    // 禁用图片优化，避免通过 /_next/image 路由加载
    unoptimized: true
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;