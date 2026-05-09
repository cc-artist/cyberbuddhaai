'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-6 text-purple-400">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last Updated: May 6, 2026</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and protect your information 
              when you use our service. We are committed to protecting your privacy and ensuring the 
              security of your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
            <h3 className="text-lg font-medium mb-2 text-gray-300">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Name and contact information</li>
              <li>Email address</li>
              <li>Account login information</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2 mt-4 text-gray-300">Usage Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>How you interact with our service</li>
              <li>Pages visited and content viewed</li>
              <li>Device information and browser details</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2 mt-4 text-gray-300">Uploaded Content</h3>
            <p className="text-gray-300">
              Any images or content you upload to our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Process and fulfill your requests</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and changes</li>
              <li>Ensure the security and integrity of our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              We implement reasonable security measures to protect your information from unauthorized 
              access, use, or disclosure. However, no method of transmission over the internet or 
              electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">
              Our service may contain links to third-party websites or services. We are not responsible 
              for the privacy practices or content of these third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience. You can 
              control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to access, correct, or delete your personal information. If you wish 
              to exercise these rights, please contact us through our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us 
              through our website.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <Link href="/" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
