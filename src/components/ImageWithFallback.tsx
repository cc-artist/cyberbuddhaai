'use client';

import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  [key: string]: any;
}

/**
 * 带有备用图片的图片组件
 * 当主图片加载失败时，显示备用图片
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/temple-images/赛博佛祖背景图.png',
  onError,
  ...props
}) => {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
    if (onError) {
      onError();
    }
  };

  return (
    <img
      src={isError ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;