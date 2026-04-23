'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  currentPage?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage }) => {
  // Get current pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/' }
  ];
  
  // Add dynamic segments
  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    // Capitalize first letter of each segment for display
    const displayName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbItems.push({ name: displayName, path: currentPath });
  }
  
  // Use provided currentPage if available
  if (currentPage && breadcrumbItems.length > 0) {
    breadcrumbItems[breadcrumbItems.length - 1].name = currentPage;
  }
  
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
