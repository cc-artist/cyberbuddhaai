'use client';

import React, { useState, useEffect } from 'react';
import { getProductionSafeImageUrl } from '../lib/imageUtils';

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
  fallbackSrc = 'temple-images/赛博佛祖背景图.png',
  onError,
  ...props
}) => {
  const [isError, setIsError] = useState(false);
  const [finalSrc, setFinalSrc] = useState('');

  useEffect(() => {
    // 使用生产环境安全的图片路径
    const safeSrc = getProductionSafeImageUrl(src);
    setFinalSrc(safeSrc);
  }, [src]);

  const handleError = () => {
    setIsError(true);
    if (onError) {
      onError();
    }
  };

  const displaySrc = isError ? fallbackSrc : finalSrc;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;