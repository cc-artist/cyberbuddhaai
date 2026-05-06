'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-6 text-purple-400">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last Updated: May 6, 2026</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using this website and service, you agree to be bound by these Terms of Service. 
              If you do not agree with any part of these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              Our service provides digital blessings and spiritual content through an online platform. 
              Users can upload items, receive personalized blessings, and share their experiences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>You must be at least 18 years old to use this service</li>
              <li>You are responsible for the accuracy of any content you submit</li>
              <li>You agree not to use the service for any illegal purposes</li>
              <li>You will respect the intellectual property rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on this website, including text, graphics, logos, and images, is protected by 
              copyright and other intellectual property laws. You may not reproduce, distribute, or 
              create derivative works without our explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Your use of our service is also governed by our Privacy Policy. Please review our Privacy 
              Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Disclaimer of Warranties</h2>
            <p className="text-gray-300 leading-relaxed">
              This service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. 
              We do not warrant that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall we be liable for any indirect, incidental, special, consequential, or 
              punitive damages arising out of or related to your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Modifications to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service 
              after changes constitute acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms shall be governed by and construed in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our website.
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
