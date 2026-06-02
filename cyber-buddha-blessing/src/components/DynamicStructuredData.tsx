'use client';

import { useEffect, useState } from 'react';

const DynamicStructuredData = () => {
  const [jsonLd, setJsonLd] = useState<any>(null);

  useEffect(() => {
    // Helper function to generate dynamic structured data based on page type
    const generateDynamicJsonLd = () => {
      const pathname = window.location.pathname;
      
      // Generate structured data based on path
      if (pathname.startsWith('/temple/')) {
        const templeId = pathname.split('/').pop();
        return {
          '@context': 'https://schema.org',
          '@type': 'PlaceOfWorship',
          name: `Cyber Buddha Temple - ${templeId}`,
          description: 'A famous Buddhist temple in China with custom meditation tours',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'China',
            addressCountry: 'CN'
          },
          url: `https://bc-drab.vercel.app${pathname}`,
          image: 'https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.jpg',
          sameAs: [
            'https://twitter.com/cyberbuddha',
            'https://facebook.com/cyberbuddha',
            'https://instagram.com/cyberbuddha'
          ]
        };
      } else if (pathname === '/admin') {
        return null;
      } else if (pathname.startsWith('/api/')) {
        return null;
      } else if (pathname === '/blessing' || pathname === '/dharma' || pathname === '/lamp') {
        const serviceName = pathname === '/blessing' ? 'Digital Blessing' : 
                            pathname === '/dharma' ? 'Dharma Form' : 'Lamp Blessing';
        
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Cyber Buddha ${serviceName}`,
          description: `Cyber Buddha ${serviceName} service - experience digital spiritual blessing`,
          provider: {
            '@type': 'Organization',
            name: 'Cyber Buddha'
          },
          url: `https://bc-drab.vercel.app${pathname}`,
          image: 'https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.png'
        };
      } else {
        return {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Cyber Buddha - Digital Blessing Service',
          description: 'Cyber Buddha Consecration · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples',
          url: 'https://bc-drab.vercel.app/',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://bc-drab.vercel.app/'
          },
          author: {
            '@type': 'Organization',
            name: 'Cyber Buddha Team',
            url: 'https://bc-drab.vercel.app/'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Cyber Buddha',
            logo: {
              '@type': 'ImageObject',
              url: 'https://bc-drab.vercel.app/favicon.ico'
            }
          },
          datePublished: '2023-01-01',
          dateModified: new Date().toISOString().split('T')[0],
          image: 'https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.jpg',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://bc-drab.vercel.app/'
              }
            ]
          }
        };
      }
    };

    setJsonLd(generateDynamicJsonLd());
  }, []);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default DynamicStructuredData;
