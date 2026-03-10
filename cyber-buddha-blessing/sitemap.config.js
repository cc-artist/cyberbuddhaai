/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://your-vercel-domain',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
    ],
  },
  exclude: ['/admin/*'],
  // 动态生成寺庙页面的URL
  additionalPaths: async (config) => {
    const { temples } = await import('./src/data/TempleData.js');
    return temples.map((temple) => ({
      loc: `${config.siteUrl}/temple/${temple.id}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));
  },
};

export default config;