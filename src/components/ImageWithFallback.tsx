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
  fallbackSrc,
  onError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // 当src变化时，重置状态
  useEffect(() => {
    // data URL 不需要任何处理，直接使用
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    // 如果是 data URL，不尝试回退，直接显示错误状态
    if (src.startsWith('data:')) {
      setHasError(true);
      return;
    }
    
    // 只在有提供fallbackSrc时才回退
    if (fallbackSrc && !hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      if (onError) {
        onError();
      }
    } else {
      // 如果没有fallback或者已经尝试过fallback，就不做任何回退
      // 保持显示原始src，让浏览器处理错误显示
      setHasError(true);
    }
  };

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