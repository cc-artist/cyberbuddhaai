import { MetadataRoute } from 'next';
import { temples } from '../data/TempleData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberbuddhaai.vercel.app';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const templePages: MetadataRoute.Sitemap = temples.map((temple) => ({
    url: `${baseUrl}/temple/${temple.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...templePages];
}