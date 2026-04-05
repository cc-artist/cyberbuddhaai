/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  assetPrefix: '',
  images: {
    // 允许本地图片加载
    unoptimized: true,
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
  webpack: (config) => {
    // 确保中文文件名能正确处理
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.test.toString().includes('\\.(png|jpe?g|gif|webp|svg)$')) {
        rule.type = 'asset/resource';
        rule.generator = {
          filename: 'temple-images/[name][ext]',
        };
      }
    });
    return config;
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;