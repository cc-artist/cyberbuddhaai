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
        url: "https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.jpg",
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
    images: ["https://bc-drab.vercel.app/temple-images/赛博佛祖背景图.jpg"],
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

// 移除了需要window访问的动态JSON-LD，使用静态数据避免服务器渲染错误
// 如需动态JSON-LD，应创建独立的客户端组件处理

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
         {/*Tiktok Developer Portal Verification*/}
        <meta name="tiktok-developers-site-verification" content="D2Uvc2nvlZmVrZv18ca81lFZ5jcHIGCm"/>
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="googleb225623b94ffa015" />
        
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
