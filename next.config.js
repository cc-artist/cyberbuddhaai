/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  // JavaScript 优化配置
  swcMinify: true,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  // 代码分割和 Tree Shaking 优化
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  // 移除未使用的 CSS
  experimental: {
    optimizeCss: true,
  },
  images: {
    // 配置图片优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    // 允许本地图片加载，与 Vercel 环境兼容
    unoptimized: true,
    // 允许 SVG 图片
    dangerouslyAllowSVG: true,
    // 配置图片域名
    domains: ['localhost', 'cyberbuddhaai.vercel.app', 'vercel.app', 'ui-avatars.com'],
    // 简化远程配置
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cyberbuddhaai.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  // 确保静态资源正确处理
  assetPrefix: '',
  // 确保中文文件名能正确处理
  webpack: (config) => {
    // 确保中文文件名能正确处理
    config.module.rules.forEach((rule) => {
      if (rule.test && rule.test.toString().includes('\.(png|jpe?g|gif|webp|svg)$')) {
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