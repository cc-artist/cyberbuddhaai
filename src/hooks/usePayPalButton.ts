import { useEffect, useState } from 'react';

interface UsePayPalButtonOptions {
  hostedButtonId: string;
  containerId: string;
  retryDelay?: number;
  maxRetries?: number;
}

interface PayPalButtonState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

export const usePayPalButton = ({
  hostedButtonId,
  containerId,
  retryDelay = 500,
  maxRetries = 10,
}: UsePayPalButtonOptions): PayPalButtonState => {
  const [state, setState] = useState<PayPalButtonState>({
    isLoading: true,
    isLoaded: false,
    error: null,
  });

  useEffect(() => {
    let retryCount = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    const initPayPalButton = () => {
      console.log(`[PayPal] Initializing button ${hostedButtonId} in container ${containerId}, attempt ${retryCount + 1}`);

      // Only execute in browser environment
      if (typeof window === 'undefined') {
        console.log('[PayPal] Not in browser environment, skipping initialization');
        setState(prev => ({ ...prev, isLoading: false, error: 'Not in browser environment' }));
        return;
      }

      try {
        // Check if PayPal SDK is loaded
        if (typeof (window as any).paypal !== 'undefined') {
          console.log('[PayPal] PayPal SDK is loaded, proceeding with button initialization');

          // Check if container element exists
          const container = document.getElementById(containerId);
          if (container) {
            console.log(`[PayPal] Container ${containerId} found, rendering button`);
            
            // Render PayPal button
            (window as any).paypal.HostedButtons({
              hostedButtonId,
            }).render(`#${containerId}`)
              .then(() => {
                console.log(`[PayPal] Button ${hostedButtonId} rendered successfully`);
                setState({
                  isLoading: false,
                  isLoaded: true,
                  error: null,
                });
              })
              .catch((renderError: any) => {
                console.error(`[PayPal] Error rendering button ${hostedButtonId}:`, renderError);
                setState({
                  isLoading: false,
                  isLoaded: false,
                  error: `Failed to render PayPal button: ${renderError.message || 'Unknown error'}`,
                });
              });
          } else {
            console.error(`[PayPal] Container ${containerId} not found`);
            setState({
              isLoading: false,
              isLoaded: false,
              error: `Container element with id "${containerId}" not found`,
            });
          }
        } else if (retryCount < maxRetries) {
          console.log(`[PayPal] PayPal SDK not loaded yet, retrying in ${retryDelay}ms (attempt ${retryCount + 2}/${maxRetries + 1})`);
          retryCount++;
          timeoutId = setTimeout(initPayPalButton, retryDelay);
        } else {
          console.error(`[PayPal] Max retries reached, PayPal SDK not loaded`);
          setState({
            isLoading: false,
            isLoaded: false,
            error: 'PayPal SDK failed to load within timeout period',
          });
        }
      } catch (error) {
        console.error(`[PayPal] Unexpected error initializing button ${hostedButtonId}:`, error);
        setState({
          isLoading: false,
          isLoaded: false,
          error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    };

    // Start initialization
    initPayPalButton();

    // Cleanup on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        console.log(`[PayPal] Cleared timeout for button ${hostedButtonId}`);
      }
    };
  }, [hostedButtonId, containerId, retryDelay, maxRetries]);

  return state;
};
