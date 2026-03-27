import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1D1D1F] text-[#F5F5F7] flex flex-col items-center justify-center py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#8676B6]/10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full bg-[#FFD700]/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* 404 Symbol */}
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            <NextImage
              src="/temple-images/赛博佛祖背景图.png"
              alt="Cyber Buddha"
              fill
              className="object-contain opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8676B6] to-[#FFD700]">
                404
              </div>
            </div>
          </div>
        </div>
        
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-xl text-[#F5F5F7]/80 mb-10 max-w-2xl mx-auto">
          The path you're looking for doesn't exist in the digital realm. Let Cyber Buddha guide you back to the right path.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Return to Home
          </Link>
          <Link
            href="/temple"
            className="bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] text-[#8676B6] px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Explore Temple Tours
          </Link>
        </div>
        
        {/* Additional Options */}
        <div className="mt-12 pt-8 border-t border-[#8676B6]/30">
          <h2 className="text-lg font-medium mb-6">Explore Other Paths</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/blessing"
              className="p-4 rounded-xl bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] hover:shadow-lg transition-all duration-300"
            >
              <div className="text-[#8676B6] mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm">Digital Blessing</p>
            </Link>
            <Link
              href="/dharma"
              className="p-4 rounded-xl bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] hover:shadow-lg transition-all duration-300"
            >
              <div className="text-[#8676B6] mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm">Dharma Form</p>
            </Link>
            <Link
              href="/lamp"
              className="p-4 rounded-xl bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] hover:shadow-lg transition-all duration-300"
            >
              <div className="text-[#8676B6] mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-sm">Lamp Blessing</p>
            </Link>
            <Link
              href="/temple"
              className="p-4 rounded-xl bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] hover:shadow-lg transition-all duration-300"
            >
              <div className="text-[#8676B6] mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm">Temple Tours</p>
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#8676B6]/30">
          <p className="text-[#F5F5F7]/60 text-sm">
            The path you sought doesn't exist in this digital realm, but there are many other paths to explore with Cyber Buddha.
          </p>
        </div>
      </div>
    </div>
  );
}
