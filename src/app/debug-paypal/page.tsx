'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const DebugPayPalPage = () => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if PayPal SDK is loaded
    const checkPaypal = () => {
      console.log('Checking if PayPal SDK is loaded...');
      if ((window as any).paypal) {
        console.log('✅ PayPal SDK is loaded!');
        setPaypalLoaded(true);
        renderButton();
      } else {
        console.log('❌ PayPal SDK not loaded yet');
      }
    };

    // Set up interval to check for PayPal SDK
    const intervalId = setInterval(checkPaypal, 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, []);

  const renderButton = () => {
    if (!containerRef.current || !(window as any).paypal) {
      console.error('Cannot render button: container or SDK not available');
      setError('Cannot render button: container or SDK not available');
      return;
    }

    try {
      console.log('Attempting to render PayPal button...');
      
      // Check if paypal.Buttons method exists
      if (!((window as any).paypal.Buttons)) {
        console.error('paypal.Buttons method not available');
        setError('paypal.Buttons method not available');
        return;
      }
      
      const buttonInstance = (window as any).paypal.Buttons({
        createOrder: function(data: any, actions: any) {
          console.log('Creating order...');
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '100.00',
                currency_code: 'USD'
              },
              description: 'Test Payment'
            }],
            intent: 'CAPTURE'
          });
        },
        onApprove: function(data: any, actions: any) {
          console.log('Order approved:', data);
          return actions.order.capture().then(function(details: any) {
            console.log('Transaction completed:', details);
          });
        },
        onError: function(err: any) {
          console.error('Payment error:', err);
          setError(`Payment error: ${err.message}`);
        }
      });

      buttonInstance.render(containerRef.current)
        .then(() => {
          console.log('✅ PayPal button rendered successfully!');
        })
        .catch((renderError: any) => {
          console.error('❌ Error rendering PayPal button:', renderError);
          setError(`Error rendering button: ${renderError.message}`);
        });
    } catch (renderError) {
      console.error('❌ Unexpected error rendering button:', renderError);
      setError(`Unexpected error: ${renderError instanceof Error ? renderError.message : String(renderError)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">PayPal Debug Page</h1>
      
      {/* PayPal SDK Script */}
      <Script
        src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD"
        strategy="afterInteractive"
        onReady={() => {
          console.log('📦 PayPal SDK script loaded via onReady');
        }}
        onError={() => {
          console.error('❌ PayPal SDK script failed to load');
          setError('PayPal SDK script failed to load');
        }}
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Debug Info</h2>
        <div className="space-y-2">
          <p><strong>PayPal SDK Loaded:</strong> {paypalLoaded ? '✅ Yes' : '⏳ No'}</p>
          {error && (
            <p className="text-red-500"><strong>Error:</strong> {error}</p>
          )}
          <p><strong>Container Ref:</strong> {containerRef.current ? '✅ Available' : '❌ Not available'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">PayPal Button</h2>
        <div 
          ref={containerRef} 
          className="w-full p-4 bg-gray-50 rounded-lg"
          style={{ minHeight: '100px' }}
        >
          {!paypalLoaded && (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg font-medium text-gray-500">
                Loading PayPal Button...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Console Logs</h2>
        <p className="text-sm text-gray-600">
          Please open your browser's developer console (F12) to see detailed logs.
        </p>
      </div>
    </div>
  );
};

export default DebugPayPalPage;