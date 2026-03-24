'use client';

import React, { useState, useEffect } from 'react';

interface ReverseInteractionWrapperProps {
  children: React.ReactNode;
  reverseIntensity?: number;
}

const ReverseInteractionWrapper: React.FC<ReverseInteractionWrapperProps> = ({
  children,
  reverseIntensity = 1,
}) => {
  const [lastMousePosition, setLastMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [offset, setOffset] = useState({
    x: 0,
    y: 0
  });

  // Handle mouse movement for reverse interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse movement delta
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;
      
      // Reverse the movement: mouse moves right → content moves left
      const reverseDeltaX = -deltaX * reverseIntensity;
      const reverseDeltaY = -deltaY * reverseIntensity;
      
      // Update offset
      setOffset(prev => ({
        x: prev.x + reverseDeltaX,
        y: prev.y + reverseDeltaY
      }));
      
      // Update last mouse position
      setLastMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up event listener
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reverseIntensity]);

  return (
    <div
      className="relative w-full"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};

export default ReverseInteractionWrapper;