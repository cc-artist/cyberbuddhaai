'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Temple } from '../data/TempleData';

interface TempleFilmStripProps {
  temples: Temple[];
  onTempleClick?: (temple: Temple) => void;
}

const TempleFilmStrip: React.FC<TempleFilmStripProps> = ({ temples, onTempleClick }) => {
  // 反向互动效果状态
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // 鼠标移动事件处理 - 基于鼠标位置相对于屏幕中心的反向互动
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  // 基于鼠标位置计算反向滚动
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 计算屏幕中心
    const centerX = window.innerWidth / 2;
    
    // 计算鼠标相对于屏幕中心的偏移比例
    const offsetRatio = (mousePosition.x - centerX) / centerX;
    
    // 应用反向滑动：鼠标在屏幕右侧 → 卡片向左滑动；鼠标在屏幕左侧 → 卡片向右滑动
    const intensity = 150; // 效果强度，数值越大效果越明显
    const targetScroll = offsetRatio * intensity;
    
    // 获取当前滚动位置
    const container = containerRef.current;
    const totalScrollWidth = container.scrollWidth - container.clientWidth;
    
    // 计算新的滚动位置，确保在合理范围内
    const newScrollLeft = Math.max(0, Math.min(totalScrollWidth, container.scrollLeft + targetScroll * 0.1));
    
    // 平滑滚动
    container.scrollLeft = newScrollLeft;
  }, [mousePosition]);
  
  // 禁用默认的拖拽行为
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      <div
        ref={containerRef}
        className="flex items-center gap-6 px-4 overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          // 添加硬件加速，减少闪烁
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
        onMouseMove={handleMouseMove}
        onDragStart={handleDragStart}
      >
        {temples.map((temple) => (
          <Link
            key={temple.id}
            href={`/temple/${temple.id}`}
            className="flex-shrink-0 w-[300px] h-[400px] bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer group"
            onClick={(e) => {
              if (onTempleClick) {
                e.preventDefault();
                onTempleClick(temple);
              }
            }}
          >
            <div className="relative w-full h-[200px] overflow-hidden">
              <img
                src={temple.image}
                alt={temple.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-bold">{temple.name}</h3>
                <p className="text-sm opacity-90">{temple.location}</p>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">{temple.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">{temple.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Custom Tour
                </span>
                <span className="font-medium text-purple-600">Learn More →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TempleFilmStrip;
