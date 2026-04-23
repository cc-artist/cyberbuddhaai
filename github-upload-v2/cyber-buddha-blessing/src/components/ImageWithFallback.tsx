'use client';

import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  [key: string]: any;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/temple-images/fHPlMoqxg.jpg',
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [errorCount, setErrorCount] = useState<number>(0);

  // 当src变化时，重置状态
  useEffect(() => {
    setCurrentSrc(src);
    setErrorCount(0);
  }, [src]);

  const handleError = () => {
    setErrorCount(prevErrorCount => {
      const newErrorCount = prevErrorCount + 1;
      
      if (prevErrorCount === 0 && fallbackSrc) {
        // 主图片加载失败，尝试使用fallback图片
        setCurrentSrc(fallbackSrc);
        if (onError) {
          onError();
        }
      } else if (prevErrorCount >= 1) {
        // fallback图片也加载失败，显示占位符
        setCurrentSrc('');
      }
      
      return newErrorCount;
    });
  };

  // 如果所有图片都加载失败，显示一个占位符
  if (!currentSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#1D1D1F]`} style={{ minHeight: '200px' }}>
        <div className="text-[#8676B6] text-sm">Image not available</div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={props.loading || 'eager'}
      style={{
        ...props.style
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;