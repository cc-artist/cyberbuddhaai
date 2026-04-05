'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Temple, temples } from '../../../data/TempleData';
import { getImageUrl } from '../../../lib/imageUtils';
import ImageWithFallback from '../../../components/ImageWithFallback';

interface TemplePageProps {
  params: { id: string };
}

const TemplePage: React.FC<TemplePageProps> = ({ params }) => {
  const router = useRouter();
  const templeId = parseInt(params.id);
  const temple = temples.find(t => t.id === templeId) || null;

  if (!temple) {
    return (
      <div className="min-h-screen bg-[#1D1D1F] text-[#F5F5F7] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Temple Not Found</h1>
        <p className="text-lg mb-8">The requested temple could not be found.</p>
        <button
          className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D1D1F] text-[#F5F5F7]">
      {/* Temple Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <ImageWithFallback
          src={getImageUrl(temple.image)}
          alt={temple.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1F] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{temple.name}</h1>
          <p className="text-lg md:text-xl text-[#F5F5F7]/90">{temple.location}</p>
          <div className="mt-4">
            <span className="bg-[#8676B6] text-white px-4 py-1 rounded-full text-sm">{temple.title}</span>
          </div>
        </div>
      </section>

      {/* Temple Content */}
      <section className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#8676B6]">About {temple.name}</h2>
              <p className="text-[#F5F5F7]/80 leading-relaxed">{temple.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#8676B6]">Tour Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {temple.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#8676B6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#F5F5F7]/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Route Planning */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#8676B6]">Route Planning</h2>
              <div className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 p-6 rounded-xl">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#8676B6] mb-2">Transportation</h3>
                  <p className="text-[#F5F5F7]/80">{temple.route.transport}</p>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#8676B6] mb-2">Itinerary</h3>
                  <pre className="text-[#F5F5F7]/80 whitespace-pre-line font-mono text-sm">{temple.route.itinerary}</pre>
                </div>
                {temple.route.combination && (
                  <div>
                    <h3 className="text-lg font-medium text-[#8676B6] mb-2">Combination Attractions</h3>
                    <p className="text-[#F5F5F7]/80">{temple.route.combination}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cultural Experiences */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#8676B6]">Cultural Experiences</h2>
              <div className="flex flex-wrap gap-3">
                {temple.culture.map((culture, index) => (
                  <span key={index} className="bg-[#8676B6]/20 text-[#8676B6] px-4 py-2 rounded-full text-sm border border-[#8676B6]/30">
                    {culture}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Highlights */}
            <div className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 text-[#8676B6]">Highlights</h2>
              <ul className="space-y-3">
                {temple.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[#F5F5F7]/80">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Back Button */}
            <div>
              <button
                className="w-full bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => router.push('/')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D1D1F] border-t border-[#8676B6]/30 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F5F5F7]/50 text-sm">© 2026 Cyber Buddha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TemplePage;