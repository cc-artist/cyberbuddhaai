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
    // 完全禁用图片优化，使用原始图片路径
    unoptimized: true,
    // 允许 SVG 图片
    dangerouslyAllowSVG: true,
  },
  // 确保静态资源正确处理
  assetPrefix: '',
  // 确保中文文件名能正确处理
  webpack: (config) => {
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