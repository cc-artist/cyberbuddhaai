import React from 'react';
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-[#1D1D1F] flex flex-col items-center justify-center text-[#F5F5F7] p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <p className="text-[#86868B] mb-8 text-center max-w-md">
        The requested admin page could not be found. Please check the URL or return to the login page.
      </p>
      <Link
        href="/admin/login"
        className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
      >
        Return to Login
      </Link>
    </div>
  );
}