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
  fallbackSrc = '/temple-images/fHPlMoqxg.jpg',
  onError,
  ...props
}) => {
  const [isError, setIsError] = useState(false);
  const [finalSrc, setFinalSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);
    const safeSrc = getImageUrl(src);
    setFinalSrc(safeSrc);
  }, [src]);

  const handleError = () => {
    setIsError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const displaySrc = isError ? getImageUrl(fallbackSrc) : finalSrc;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default ImageWithFallback;
