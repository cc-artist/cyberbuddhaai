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


  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;