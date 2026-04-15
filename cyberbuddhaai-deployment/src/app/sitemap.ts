import { MetadataRoute } from 'next';
import { temples } from '../data/TempleData';

export default function sitemap(): MetadataRoute.Sitemap {
  // 生成所有寺庙页面的URL
  const templeUrls = temples.map(temple => ({
    url: `https://bc-drab.vercel.app/temple/${temple.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://bc-drab.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...templeUrls,
  ];
}