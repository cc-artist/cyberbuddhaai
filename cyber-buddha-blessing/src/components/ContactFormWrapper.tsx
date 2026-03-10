'use client';

import React, { useState } from 'react';
import ContactForm from './ContactForm';

interface ContactFormWrapperProps {
  templeName: string;
}

const ContactFormWrapper: React.FC<ContactFormWrapperProps> = ({ templeName }) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  
  const handleOpenContactForm = () => {
    setIsContactFormOpen(true);
  };
  
  return (
    <>
      <button
        className="w-full bg-[#8676B6] text-white py-4 px-6 rounded-lg font-medium hover:bg-[#8676B6]/90 transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#8676B6]"
        onClick={handleOpenContactForm}
        disabled={false}
      >
        Consult Customer Service to Book
      </button>
      
      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        templeName={templeName}
      />
    </>
  );
};

export default ContactFormWrapper;