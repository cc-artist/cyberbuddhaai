import type { Metadata } from "next";
import React from "react";
import { SessionProviderClient } from "./providers/SessionProviderClient";
import Breadcrumb from "../components/Breadcrumb";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyber Buddha",
  description: "Cyber Buddha Consecration · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples",
  keywords: ["Cyber Buddha", "Buddha Blessing", "Digital Consecration", "Zen Experience", "Buddha Animation", "Spiritual Technology", "Temple Tours", "Zen Meditation", "Buddhist Culture", "Digital Spirituality"],
  openGraph: {
    title: "Cyber Buddha",
    description: "Cyber Buddha Consecration · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples",
    type: "website",
    url: "https://bc-drab.vercel.app/",
    siteName: "Cyber Buddha",
    images: [
      {
        url: "https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.png",
        width: 1200,
        height: 630,
        alt: "Cyber Buddha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Buddha",
    description: "Cyber Buddha Consecration · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples",
    images: ["https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.png"],
    creator: "@cyberbuddha",
  },
  alternates: {
    canonical: "https://bc-drab.vercel.app/",
  },
  authors: [{
    name: "Cyber Buddha Team",
    url: "https://bc-drab.vercel.app/",
  }],
  publisher: "Cyber Buddha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cyber Buddha",
  },
};

// Use generateViewport for viewport configuration
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#8676B6",
  };
}

// Simple Error Boundary Component for Client-Side
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return children;
};

// Organization structured data
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cyber Buddha',
  description: 'Cyber Buddha Consecration · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples',
  url: 'https://bc-drab.vercel.app/',
  logo: 'https://bc-drab.vercel.app/favicon.ico',
  sameAs: [
    'https://twitter.com/cyberbuddha',
    'https://facebook.com/cyberbuddha',
    'https://instagram.com/cyberbuddha',
  ],
};

// BreadcrumbList structured data
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://bc-drab.vercel.app/'
    }
  ]
};

// WebSite structured data
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cyber Buddha',
  url: 'https://bc-drab.vercel.app/',
  description: 'Digital spiritual blessing service where users upload item photos and AI generates an animation of Buddha holding the item with chanting background music.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://bc-drab.vercel.app/?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

// Helper function to generate dynamic structured data based on page type
const generateDynamicJsonLd = () => {
  // Get current pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Generate structured data based on path
  if (pathname.startsWith('/temple/')) {
    // Temple page structured data
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
      image: 'https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.png',
      sameAs: [
        'https://twitter.com/cyberbuddha',
        'https://facebook.com/cyberbuddha',
        'https://instagram.com/cyberbuddha'
      ]
    };
  } else if (pathname === '/admin') {
    // Admin page - no specific structured data needed
    return null;
  } else if (pathname.startsWith('/api/')) {
    // API endpoints - no structured data needed
    return null;
  } else if (pathname === '/blessing' || pathname === '/dharma' || pathname === '/lamp') {
    // Service pages structured data
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
    // Home page and other pages - add general content structured data
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
      image: 'https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Dynamic structured data based on page type */}
        {(() => {
          const dynamicJsonLd = generateDynamicJsonLd();
          return dynamicJsonLd ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(dynamicJsonLd) }}
            />
          ) : null;
        })()}
      </head>
      <body className="antialiased">
        <SessionProviderClient>
          <Breadcrumb />
          <main>
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </SessionProviderClient>
      </body>
    </html>
  );
}
