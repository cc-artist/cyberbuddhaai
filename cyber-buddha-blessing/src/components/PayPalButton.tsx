'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  amount: string;
  description: string;
  name: string;
  className?: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  amount, 
  description, 
  name,
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const buttonInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      setError('Not in browser environment');
      return;
    }

    // Clear any existing button instance
    if (buttonInstanceRef.current) {
      try {
        buttonInstanceRef.current.close();
      } catch (e) {
        console.error('[PayPal] Error closing existing button:', e);
      }
      buttonInstanceRef.current = null;
    }

    const checkAndRenderButton = () => {
      if ((window as any).paypal && containerRef.current) {
        renderButton();
      } else if (!isLoading) {
        // If we're not already loading, start loading again
        setIsLoading(true);
        setError(null);
      }
    };

    // Check if PayPal SDK is already loaded
    if ((window as any).paypal) {
      console.log('[PayPal] SDK already loaded, rendering button immediately');
      renderButton();
    } else {
      console.log('[PayPal] SDK not yet loaded, setting up listeners');
      // Set up a timeout to check if PayPal SDK loads
      const timeoutId = setTimeout(() => {
        if (!(window as any).paypal) {
          console.error('[PayPal] SDK failed to load within timeout period');
          setIsLoading(false);
          setError('PayPal SDK failed to load. Please try refreshing the page.');
        }
      }, 10000); // 10 seconds timeout

      // Listen for PayPal SDK load event
      const handlePayPalSDKLoad = () => {
        console.log('[PayPal] SDK loaded via event');
        clearTimeout(timeoutId);
        renderButton();
      };

      // Also check periodically if SDK has loaded (fallback for cases where event doesn't fire)
      const intervalId = setInterval(() => {
        if ((window as any).paypal) {
          console.log('[PayPal] SDK loaded, detected via interval check');
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          window.removeEventListener('paypal-sdk:loaded', handlePayPalSDKLoad);
          renderButton();
        }
      }, 500);

      window.addEventListener('paypal-sdk:loaded', handlePayPalSDKLoad);

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        window.removeEventListener('paypal-sdk:loaded', handlePayPalSDKLoad);
      };
    }
  }, [amount, description, name]);

  const renderButton = () => {
    if (!containerRef.current || !(window as any).paypal) {
      console.error('[PayPal] Cannot render button: container or SDK not available');
      setIsLoading(false);
      setError('Cannot initialize PayPal button. Please try refreshing the page.');
      return;
    }

    try {
      console.log('[PayPal] Rendering button with:', { amount, description, name });
      
      // Render PayPal Smart Payment Button
      const buttonInstance = (window as any).paypal.Buttons({
        createOrder: function(data: any, actions: any) {
          console.log('[PayPal] Creating order with:', { amount, description, name });
          try {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount,
                  currency_code: 'USD'
                },
                description: description,
                name: name
              }]
            });
          } catch (orderError) {
            console.error('[PayPal] Error creating order:', orderError);
            alert('Error creating payment order. Please try again.');
            throw orderError;
          }
        },
        onApprove: function(data: any, actions: any) {
          console.log('[PayPal] Order approved:', data);
          return actions.order.capture().then(function(details: any) {
            // Show a success message to the buyer
            alert('Thank you for your booking! Your order has been confirmed.');
            console.log('Transaction completed by ' + details.payer.name.given_name);
            // You can also redirect to a success page here
          }).catch(function(captureError: any) {
            console.error('[PayPal] Error capturing order:', captureError);
            alert('Error processing your payment. Please contact customer service.');
          });
        },
        onError: function(err: any) {
          // Show a detailed error message to the buyer
          console.error('[PayPal] Payment error:', err);
          let errorMessage = 'Sorry, there was an error processing your payment. Please try again.';
          if (err.message) {
            errorMessage += ` Error: ${err.message}`;
          }
          alert(errorMessage);
        },
        onCancel: function(data: any) {
          console.log('[PayPal] Payment cancelled:', data);
          alert('Payment cancelled. You can try again later.');
        }
      });

      // Store the button instance for later cleanup
      buttonInstanceRef.current = buttonInstance;

      buttonInstance.render(containerRef.current)
        .then(() => {
          console.log('[PayPal] Button rendered successfully');
          setIsLoading(false);
          setError(null);
        })
        .catch((renderError: any) => {
          console.error('[PayPal] Error rendering button:', renderError);
          setIsLoading(false);
          // Check if renderError is an Error instance before accessing message
          const errorMessage = renderError instanceof Error ? renderError.message : 'Unknown error';
          setError(`Error rendering PayPal button: ${errorMessage}`);
        });
    } catch (renderError) {
      console.error('[PayPal] Unexpected error rendering button:', renderError);
      setIsLoading(false);
      // Check if renderError is an Error instance before accessing message
      const errorMessage = renderError instanceof Error ? renderError.message : 'Unknown error';
      setError(`Unexpected error: ${errorMessage}`);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {isLoading ? (
        <div className="w-full text-center border-none rounded-lg px-6 py-4 font-medium bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[#1D1D1F] font-inherit text-base leading-5 cursor-not-allowed opacity-70">
          Loading Payment Button...
        </div>
      ) : error ? (
        <div className="w-full text-center border-none rounded-lg px-6 py-4 font-medium bg-red-500 text-white font-inherit text-base leading-5">
          {error}
        </div>
      ) : (
        <div ref={containerRef} className="w-full"></div>
      )}
    </div>
  );
};

export default PayPalButton;