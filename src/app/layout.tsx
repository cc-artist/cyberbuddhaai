import type { Metadata } from "next";
import React from "react";
import { SessionProviderClient } from "./providers/SessionProviderClient";
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
      </head>
      <body className="antialiased">
        <SessionProviderClient>
          <ErrorBoundary>{children}</ErrorBoundary>
        </SessionProviderClient>
      </body>
    </html>
  );
}
