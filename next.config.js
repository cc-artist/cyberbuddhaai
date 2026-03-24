/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  images: {
    // 允许本地图片加载
    unoptimized: false,
    // 移除可能导致问题的配置
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'",
    // 简化远程配置
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;