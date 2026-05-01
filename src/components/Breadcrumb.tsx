'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbProps {
  currentPage?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage }) => {
  // Get current pathname using Next.js hook
  const pathname = usePathname() || '';
  // Server-side and initial client-side render only Home link
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { name: 'Home', path: '/' }
  ]);
  
  // Use useEffect to update breadcrumb on client side after hydration
  useEffect(() => {
    // Only update breadcrumb if pathname is not empty
    if (pathname) {
      const pathSegments = pathname.split('/').filter(segment => segment);
      const items = [
        { name: 'Home', path: '/' }
      ];
      
      // Add dynamic segments
      let currentPath = '';
      for (const segment of pathSegments) {
        currentPath += `/${segment}`;
        // Capitalize first letter of each segment for display
        const displayName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        items.push({ name: displayName, path: currentPath });
      }
      
      // Use provided currentPage if available
      if (currentPage && items.length > 0) {
        items[items.length - 1].name = currentPage;
      }
      
      setBreadcrumbItems(items);
    }
  }, [pathname, currentPage]);
  
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 bg-[#1D1D1F] border-b border-[#8676B6]/30">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <svg className="w-4 h-4 text-[#8676B6] mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-[#8676B6] font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="text-[#F5F5F7]/70 hover:text-[#8676B6] transition-colors duration-300">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
