'use client';

import React from 'react';
import NextImage from 'next/image';
import { Temple } from '../data/TempleData';
import ContactForm from './ContactForm';

interface TempleDetailModalProps {
  temple: Temple | null;
  isOpen: boolean;
  onClose: () => void;
  onPayment: () => void;
  isContactFormOpen: boolean;
  onOpenContactForm: () => void;
  onCloseContactForm: () => void;
  isPaying?: boolean;
}

const TempleDetailModal: React.FC<TempleDetailModalProps> = ({ 
  temple, 
  isOpen, 
  onClose, 
  onPayment,
  isContactFormOpen,
  onOpenContactForm,
  onCloseContactForm,
  isPaying = false
}) => {
  if (!temple || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1D1F]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#1D1D1F] border border-[#8676B6]/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-[#8676B6]/20 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#8676B6]/30 transition-colors duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-[#8676B6]"
          onClick={onClose}
          aria-label="Close temple details"
          type="button"
        >
          <svg className="w-6 h-6 text-[#8676B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side Image */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto">
            <img
              src={temple.image}
              alt={temple.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#1D1D1F]/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{temple.name}</h2>
              <p className="text-sm opacity-90">{temple.location}</p>
              <p className="text-sm mt-2 bg-[#8676B6] inline-block px-3 py-1 rounded-full">{temple.title}</p>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="w-full md:w-1/2 overflow-y-auto p-6">
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#8676B6] mb-2">Temple Introduction</h3>
              <p className="text-[#F5F5F7]/80 leading-relaxed">{temple.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#8676B6] mb-3">Tour Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {temple.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#F5F5F7]/70">
                    <svg className="w-5 h-5 text-[#8676B6] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Route Planning */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#8676B6] mb-3">Route Planning</h3>
              <div className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 p-4 rounded-lg">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-[#8676B6] mb-1">Transportation</h4>
                  <p className="text-sm text-[#F5F5F7]/70">{temple.route.transport}</p>
                </div>
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-[#8676B6] mb-1">Itinerary</h4>
                  <p className="text-sm text-[#F5F5F7]/70 whitespace-pre-line">{temple.route.itinerary}</p>
                </div>
                {temple.route.combination && (
                  <div>
                    <h4 className="text-sm font-medium text-[#8676B6] mb-1">Combination Attractions</h4>
                    <p className="text-sm text-[#F5F5F7]/70">{temple.route.combination}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cultural Experiences */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#8676B6] mb-3">Cultural Experiences</h3>
              <div className="flex flex-wrap gap-2">
                {temple.culture.map((culture, index) => (
                  <span key={index} className="bg-[#8676B6]/10 text-[#8676B6] px-3 py-1 rounded-full text-sm border border-[#8676B6]/30">
                    {culture}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#8676B6]/30">
              <button
                className="flex-1 bg-[#8676B6] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#8676B6]/90 transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#8676B6]"
                onClick={onOpenContactForm}
                disabled={isPaying || isContactFormOpen}
              >
                Consult Customer Service to Book
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[#1D1D1F] py-3 px-4 rounded-lg font-medium hover:from-[#FFD700]/90 hover:to-[#FF6B00]/90 transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-[#FFD700] disabled:hover:to-[#FF6B00]"
                onClick={onPayment}
                disabled={isPaying || isContactFormOpen}
              >
                {isPaying ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1D1D1F]/30 border-t-[#1D1D1F] rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  'Pay $10,000 USD to Book'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isContactFormOpen}
        onClose={onCloseContactForm}
        templeName={temple.name}
      />
    </div>
  );
};

export default TempleDetailModal;
