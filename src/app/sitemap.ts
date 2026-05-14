import { MetadataRoute } from 'next';
import { temples } from '../data/TempleData';

export default function sitemap(): MetadataRoute.Sitemap {
  // 生成所有寺庙页面的URL
  const templeUrls = temples.map(temple => ({
    url: `https://cyberbuddhaai.vercel.app/temple/${temple.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://cyberbuddhaai.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://cyberbuddhaai.vercel.app/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://cyberbuddhaai.vercel.app/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...templeUrls,
  ];
}