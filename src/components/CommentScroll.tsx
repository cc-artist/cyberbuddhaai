'use client';

import React, { useState, useEffect, useRef } from 'react';
import ImageWithFallback from './ImageWithFallback';

interface Comment {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  pageUrl: string;
  createdAt: Date;
  userName: string;
  userComment: string;
  userAvatar: string;
}

const CommentScroll: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const commentWidth = 180;
  const gap = 12;
  const totalItemWidth = commentWidth + gap;
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  const loadComments = async () => {
    try {
      const response = await fetch('/api/public/comments', { cache: 'no-store' });
      
      if (response.ok) {
        const dbComments = await response.json();
        const formattedComments = dbComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        
        setComments(formattedComments);
      }
    } catch (error) {
      setComments([]);
    }
  };
  
  useEffect(() => {
    loadComments();
    
    const interval = setInterval(() => {
      loadComments();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const displayComments = comments;
  const displayCount = 7;

  // 获取要显示的评论（复制两份以实现无缝循环）
  const getDisplayComments = () => {
    const result = [];
    // 显示双倍数量的评论以实现无缝循环
    for (let i = 0; i < displayCount * 2; i++) {
      const index = i % displayComments.length;
      result.push({
        comment: displayComments[index],
        originalIndex: index
      });
    }
    return result;
  };

  // 平滑滚动动画
  useEffect(() => {
    if (displayComments.length < 2) return;

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTimestampRef.current;
      // 调整滚动速度（像素/毫秒）
      const speed = 0.05;
      const delta = elapsed * speed;
      
      setScrollPosition(prev => {
        const newPosition = prev + delta;
        const totalScrollWidth = displayCount * totalItemWidth;
        
        // 当滚动到一半时重置位置，实现无缝循环
        if (newPosition >= totalScrollWidth) {
          return 0;
        }
        return newPosition;
      });
      
      lastTimestampRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [displayComments.length]);

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 max-w-7xl mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        {/* 渐变遮罩 - 左侧 */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #1D1D1F 0%, transparent 100%)'
          }}
        />
        
        {/* 渐变遮罩 - 右侧 */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #1D1D1F 0%, transparent 100%)'
          }}
        />
        
        {displayComments.length > 0 && (
          <div 
            className="flex gap-3 absolute"
            style={{ 
              transform: `translateX(-${scrollPosition}px)`,
              willChange: 'transform'
            }}
          >
            {getDisplayComments().map(({ comment, originalIndex }, i) => (
              <div 
                key={`${comment.id}-${i}`}
                className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg p-3 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#8676B6]/60"
                style={{ 
                  width: `${commentWidth}px`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="relative w-full h-32 overflow-hidden rounded-md border border-[#8676B6]/30 mb-3">
                  <ImageWithFallback
                    src={comment.imageUrl}
                    alt={comment.title}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  {/* 微光效果 */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#8676B6]/10 to-transparent pointer-events-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#8676B6]/30 flex-shrink-0">
                      <ImageWithFallback 
                        src={comment.userAvatar} 
                        alt={comment.userName} 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-xs font-medium text-[#F5F5F7] truncate">{comment.userName}</span>
                      <span className="text-[#F5F5F7]/50 text-[9px] flex-shrink-0">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-xs font-semibold text-[#8676B6] line-clamp-1">{comment.title}</h4>
                  
                  {comment.userComment && (
                    <div className="bg-[#1D1D1F]/70 border border-[#8676B6]/20 rounded-md p-2">
                      <p className="text-[#F5F5F7]/80 italic text-[10px] line-clamp-2">"{comment.userComment}"</p>
                    </div>
                  )}
                  
                  <p className="text-[#F5F5F7]/70 text-[10px] line-clamp-1">{comment.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {displayComments.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-[#F5F5F7]/70 text-sm">No comments yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
};

export default CommentScroll;
