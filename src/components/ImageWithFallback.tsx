import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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
    
    // 确保路径是绝对路径
    let safeSrc = src;
    if (safeSrc && !safeSrc.startsWith('http://') && !safeSrc.startsWith('https://') && !safeSrc.startsWith('/')) {
      safeSrc = '/' + safeSrc;
    }
    
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

  // 处理fallback路径
  let displaySrc = isError ? fallbackSrc : finalSrc;
  if (displaySrc && !displaySrc.startsWith('http://') && !displaySrc.startsWith('https://') && !displaySrc.startsWith('/')) {
    displaySrc = '/' + displaySrc;
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      unoptimized={true}
      {...props}
    />
  );
};

export default ImageWithFallback;
