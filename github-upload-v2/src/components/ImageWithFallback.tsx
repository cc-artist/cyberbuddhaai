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
  const [isError, setIsError] = useState(false);
  const [finalSrc, setFinalSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasFallbackError, setHasFallbackError] = useState(false);

  useEffect(() => {
    setIsError(false);
    setHasFallbackError(false);
    setIsLoading(true);
    
    // 确保路径是绝对路径
    let safeSrc = src;
    if (safeSrc && !safeSrc.startsWith('http://') && !safeSrc.startsWith('https://') && !safeSrc.startsWith('/')) {
      safeSrc = '/' + safeSrc;
    }
    
    setFinalSrc(safeSrc);
  }, [src]);

  // 添加日志来调试图片加载
  useEffect(() => {
    console.log('ImageWithFallback props:', { src, fallbackSrc });
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setIsLoading(false);
      if (onError) {
        onError();
      }
    } else {
      // 防止fallback图片也加载失败时的无限循环
      setHasFallbackError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // 处理fallback路径
  let displaySrc = '';
  if (!isError && !hasFallbackError) {
    displaySrc = finalSrc;
  } else if (isError && !hasFallbackError) {
    displaySrc = fallbackSrc;
  }
  
  // 确保路径是绝对路径
  if (displaySrc && !displaySrc.startsWith('http://') && !displaySrc.startsWith('https://') && !displaySrc.startsWith('/')) {
    displaySrc = '/' + displaySrc;
  }

  // 如果所有图片都加载失败，显示一个占位符
  if (!displaySrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#1D1D1F]`} style={{ minHeight: '200px' }}>
        <div className="text-[#8676B6] text-sm">Image not available</div>
      </div>
    );
  }

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
