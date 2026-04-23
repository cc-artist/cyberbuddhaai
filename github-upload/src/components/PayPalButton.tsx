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
  const [buttonRendered, setButtonRendered] = useState(false);

  // 简化的PayPal按钮渲染逻辑
  const renderPayPalButton = async () => {
    console.log('[PayPal] Starting renderPayPalButton function');
    
    if (typeof window === 'undefined') {
      console.error('[PayPal] Not in browser environment');
      setIsLoading(false);
      setError('Not in browser environment');
      return;
    }

    if (!containerRef.current) {
      console.error('[PayPal] Container not found');
      setIsLoading(false);
      setError('Payment button container not found');
      return;
    }

    // 检查PayPal SDK是否加载
    if (!(window as any).paypal) {
      console.error('[PayPal] PayPal SDK not loaded');
      setIsLoading(false);
      setError('PayPal service not available. Please check your internet connection or try again later.');
      return;
    }

    // 检查paypal.Buttons方法是否存在
    if (!((window as any).paypal.Buttons)) {
      console.error('[PayPal] paypal.Buttons method not available');
      setIsLoading(false);
      setError('PayPal service not properly configured');
      return;
    }

    try {
      console.log('[PayPal] Creating PayPal button instance');
      
      // 创建PayPal按钮
      const button = (window as any).paypal.Buttons({
        // 隐藏技术支持提供方文本
        style: {
          layout: 'horizontal', // 尝试使用水平布局，可能会自动隐藏标签行
          tagline: false, // 隐藏"技术支持提供方：PAYPAL"文本
          fundingicons: true,
          // 添加更多样式选项确保标签行隐藏
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48
        },
        createOrder: (data: any, actions: any) => {
          console.log('[PayPal] Creating order');
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount,
                currency_code: 'USD'
              },
              description: description
            }],
            intent: 'CAPTURE'
          });
        },
        onApprove: (data: any, actions: any) => {
          console.log('[PayPal] Order approved');
          return actions.order.capture().then((details: any) => {
            console.log('[PayPal] Payment captured successfully');
            alert('Thank you for your booking! Your order has been confirmed.');
          }).catch((err: any) => {
            console.error('[PayPal] Error capturing payment:', err);
            alert('Error processing your payment. Please contact customer service.');
          });
        },
        onError: (err: any) => {
          console.error('[PayPal] Payment error:', err);
          alert('Sorry, there was an error processing your payment. Please try again.');
        }
      });

      console.log('[PayPal] Rendering PayPal button to container');
      
      // 渲染按钮
      await button.render(containerRef.current);
      
      console.log('[PayPal] Button rendered successfully!');
      setIsLoading(false);
      setError(null);
      setButtonRendered(true);
      
      // 保存按钮实例以便后续清理
      buttonInstanceRef.current = button;
    } catch (err) {
      console.error('[PayPal] Error rendering button:', err);
      setIsLoading(false);
      setError(`Failed to load payment button: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    console.log('[PayPal] useEffect triggered');
    
    // 重置状态
    setIsLoading(true);
    setError(null);
    setButtonRendered(false);

    // 清理之前的按钮实例
    if (buttonInstanceRef.current) {
      try {
        buttonInstanceRef.current.close();
        console.log('[PayPal] Closed previous button instance');
      } catch (err) {
        console.error('[PayPal] Error closing previous button:', err);
      }
      buttonInstanceRef.current = null;
    }

    // 检查PayPal SDK是否已经加载
    if ((window as any).paypal) {
      console.log('[PayPal] PayPal SDK already loaded, rendering button immediately');
      renderPayPalButton();
    } else {
      console.log('[PayPal] Waiting for PayPal SDK to load');
      
      // 设置定时器检查PayPal SDK加载情况
      const timer = setInterval(() => {
        console.log('[PayPal] Checking if PayPal SDK is loaded...');
        if ((window as any).paypal) {
          console.log('[PayPal] PayPal SDK loaded, rendering button');
          clearInterval(timer);
          renderPayPalButton();
        }
      }, 500);

      // 设置超时 - 但不显示错误，保持加载状态以允许用户手动刷新
      const timeout = setTimeout(() => {
        console.warn('[PayPal] PayPal SDK loading took longer than expected');
        // 不设置错误状态，保持加载状态，避免显示不必要的错误信息
        // 用户可以选择手动刷新页面
      }, 15000);

      // 清理函数
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [amount, description, name]);

  return (
    <div className={`w-full ${className}`}>
      {/* Always render the container div with ref, regardless of loading or error state */}
      <div 
        ref={containerRef} 
        className="w-full"
        style={{ minHeight: '48px' }} // 设置最小高度，确保按钮有足够空间
      >
        {/* Show loading state if still loading */}
        {isLoading && (
          <div className="w-full text-center border-none rounded-lg px-6 py-4 font-medium bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[#1D1D1F] font-inherit text-base leading-5 cursor-not-allowed opacity-70">
            Loading Payment Button...
          </div>
        )}
        
        {/* Show error message if there's an error */}
        {error && (
          <div className="w-full text-center border-none rounded-lg px-6 py-4 font-medium bg-red-500 text-white font-inherit text-base leading-5">
            {error}
          </div>
        )}
      </div>
      
      {/* 移除开发环境调试信息 */}
    </div>
  );
};

export default PayPalButton;