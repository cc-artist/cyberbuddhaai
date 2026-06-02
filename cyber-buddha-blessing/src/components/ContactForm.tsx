'use client';

import React, { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  templeName: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  isOpen, 
  onClose, 
  templeName 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: `Consultation about ${templeName} tour`,
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitSuccess(false);
      setSubmitError(false);
      
      // Call actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          templeName
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit message');
      }
      
      const data = await response.json();
      console.log('[API] Contact form submitted:', data);
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          email: '',
          subject: `Consultation about ${templeName} tour`,
          message: ''
        });
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1D1F]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1D1D1F] border border-[#8676B6]/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-[#8676B6]/20 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-[#8676B6]/30 transition-colors duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-[#8676B6]"
          onClick={onClose}
          aria-label="Close contact form"
          type="button"
        >
          <svg className="w-6 h-6 text-[#8676B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#F5F5F7]">
            Contact Us - {templeName}
          </h2>

          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold text-[#F5F5F7] mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-[#F5F5F7]/70">
                Thank you for your message. We will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#1D1D1F]/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#8676B6]/30 focus:ring-[#8676B6]'}`}
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#1D1D1F]/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#8676B6]/30 focus:ring-[#8676B6]'}`}
                  placeholder="Your email address"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#1D1D1F]/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-[#8676B6]/30 focus:ring-[#8676B6]'}`}
                  disabled={isSubmitting}
                >
                  <option value={`Consultation about ${templeName} tour`}>
                    Consultation about {templeName} tour
                  </option>
                  <option value={`Custom itinerary for ${templeName}`}>
                    Custom itinerary for {templeName}
                  </option>
                  <option value={`Pricing for ${templeName} tour`}>
                    Pricing for {templeName} tour
                  </option>
                  <option value={`Availability for ${templeName} tour`}>
                    Availability for {templeName} tour
                  </option>
                  <option value="Other">Other</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 bg-[#1D1D1F]/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-[#8676B6]/30 focus:ring-[#8676B6]'}`}
                  placeholder="Your message here..."
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#8676B6] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#8676B6]/90 transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#8676B6]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>

              {submitError && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <p className="text-red-500">
                    Failed to send message. Please try again later.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;