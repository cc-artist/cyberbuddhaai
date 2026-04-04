'use client';

import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../lib/imageUtils';

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
    // 使用统一的图片路径处理函数
    const safeSrc = getImageUrl(src);
    setFinalSrc(safeSrc);
  }, [src]);

  const handleError = () => {
    setIsError(true);
    if (onError) {
      onError();
    }
  };

  const displaySrc = isError ? getImageUrl(fallbackSrc) : finalSrc;

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