'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ImageWithFallback from './ImageWithFallback';

interface Comment {
  _id: string;
  id?: string;
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
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const mountedRef = useRef(true);

  // 优化评论加载 - 添加缓存机制
  const loadComments = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/public/comments', { 
        cache: 'force-cache',
        next: { revalidate: 60 }, // 60秒缓存
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok && mountedRef.current) {
        const dbComments = await response.json();
        const formattedComments = dbComments.map((comment: any) => ({
          ...comment,
          id: comment._id || comment.id,
          createdAt: new Date(comment.createdAt)
        }));
        
        // 去重 - 确保没有重复评论
        const uniqueComments = formattedComments.filter((comment: Comment, index: number, self: Comment[]) =>
          index === self.findIndex((c) => (c._id || c.id) === (comment._id || comment.id))
        );
        
        setComments(uniqueComments);
      }
    } catch (error) {
      if (mountedRef.current) {
        console.error('Failed to load comments:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    mountedRef.current = true;
    loadComments();
    
    // 延长刷新间隔到2分钟，减少API调用
    const interval = setInterval(() => {
      if (mountedRef.current) {
        loadComments();
      }
    }, 120000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadComments]);

  // 使用所有可用的评论，如果没有评论则显示空状态
  const displayComments = comments.length > 0 ? comments : [];
  
  // 无缝滚动实现
  const getDisplayComments = () => {
    if (displayComments.length === 0) return [];
    
    // 需要显示的数量 - 至少显示3个，最多显示10个
    const targetCount = Math.max(3, Math.min(10, displayComments.length));
    
    // 复制多份以实现无缝循环
    const result = [];
    for (let i = 0; i < targetCount * 3; i++) {
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
    if (displayComments.length < 1) return;

    const animate = (timestamp: number) => {
      if (!mountedRef.current) return;
      
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTimestampRef.current;
      // 优化滚动速度
      const speed = 0.03;
      const delta = elapsed * speed;
      
      setScrollPosition(prev => {
        const newPosition = prev + delta;
        const totalScrollWidth = displayComments.length * totalItemWidth;
        
        // 当滚动到超过一半时，重置位置实现无缝循环
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
        
        {displayComments.length > 0 ? (
          <div 
            className="flex gap-3 absolute"
            style={{ 
              transform: `translateX(-${scrollPosition}px)`,
              willChange: 'transform'
            }}
          >
            {getDisplayComments().map(({ comment, originalIndex }, i) => (
              <div 
                key={`${comment._id || comment.id}-${i}`}
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
                    loading="lazy" // 懒加载图片
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
                        loading="lazy" // 懒加载图片
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <i className="fas fa-comments text-4xl text-[#8676B6]/50 mb-2"></i>
              <p className="text-[#F5F5F7]/70 text-sm">No comments yet. Be the first to share!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentScroll;
