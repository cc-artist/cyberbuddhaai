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
    url: "/",
    siteName: "Cyber Buddha",
    images: [
      {
        url: "/temple-images/赛博佛祖背景图.png",
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
    images: ["/temple-images/赛博佛祖背景图.png"],
    creator: "@cyberbuddha",
  },
  alternates: {
    canonical: "/",
  },
  authors: [{
    name: "Cyber Buddha Team",
    url: "/",
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
  url: '/',
  logo: '/favicon.ico',
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
      item: '/'
    }
  ]
};

// WebSite structured data
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cyber Buddha',
  url: '/',
  description: 'Digital spiritual blessing service where users upload item photos and AI generates an animation of Buddha holding the item with chanting background music.',
  potentialAction: {
    '@type': 'SearchAction',
    target: '/?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

// Helper function to generate dynamic structured data based on page type
const generateDynamicJsonLd = () => {
  // Always return home page structured data for server-side rendering
  // Client-side path detection is handled in individual pages if needed
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cyber Buddha - Digital Blessing Service',
    description: 'Cyber Buddha Consecration · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples',
    url: '/',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': '/'
    },
    author: {
      '@type': 'Organization',
      name: 'Cyber Buddha Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cyber Buddha'
    },
    datePublished: '2023-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="bajCDE-i5PyEVAI2bVttLhAyAB0kCP9JnfS2dWGkE2A" />
        
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateDynamicJsonLd()) }}
        />
      </head>
      <body className="antialiased">
        <SessionProviderClient>
          <Breadcrumb />
          <ErrorBoundary>{children}</ErrorBoundary>
        </SessionProviderClient>
      </body>
    </html>
  );
}
