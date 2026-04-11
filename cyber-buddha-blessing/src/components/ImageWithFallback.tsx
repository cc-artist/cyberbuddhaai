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
  fallbackSrc = 'https://via.placeholder.com/1200x800?text=Cyber+Buddha+Background',
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

  const displaySrc = isError ? fallbackSrc : getProductionSafeImageUrl(src);

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{
        ...props.style
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;