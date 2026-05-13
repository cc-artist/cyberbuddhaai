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

  // 从数据库和localStorage获取评论数据
  const loadComments = async () => {
    // 首先尝试从localStorage获取评论，作为备用
    const getLocalStorageComments = () => {
      try {
        const storedComments = localStorage.getItem('cyberBuddhaComments');
        if (storedComments) {
          const parsedComments = JSON.parse(storedComments);
          return parsedComments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          }));
        }
        return [];
      } catch (error) {
        return [];
      }
    };
    
    const localComments = getLocalStorageComments();
    if (localComments.length > 0) {
      setComments(localComments);
    }
    
    try {
      const response = await fetch('/api/public/comments', { cache: 'no-store' });
      
      if (response.ok) {
        const dbComments = await response.json();
        const formattedComments = dbComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        
        if (formattedComments.length > 0) {
          setComments(formattedComments);
        }
      }
    } catch (error) {
      // 静默处理错误
    }
  };
  
  useEffect(() => {
    loadComments();
    
    const interval = setInterval(() => {
      loadComments();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const defaultComments: Comment[] = [
    { id: 'default-1', imageUrl: '/temple-images/灵隐寺.webp', title: 'My First Blessing', description: 'Received my digital blessing today!', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Cyber Monk', userComment: 'May peace and wisdom fill your heart', userAvatar: 'https://ui-avatars.com/api/?name=Monk&background=random' },
    { id: 'default-2', imageUrl: '/temple-images/少林寺.webp', title: 'Enlightenment', description: 'Feeling truly blessed', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Dharma Seeker', userComment: 'Amazing experience!', userAvatar: 'https://ui-avatars.com/api/?name=Seeker&background=random' },
    { id: 'default-3', imageUrl: '/temple-images/塔尔寺.webp', title: 'Peaceful', description: 'Inner peace achieved', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Zen Master', userComment: 'Highly recommend', userAvatar: 'https://ui-avatars.com/api/?name=Zen&background=random' },
    { id: 'default-4', imageUrl: '/temple-images/寒山寺.webp', title: 'Great Service', description: 'Wonderful blessing', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Happy User', userComment: 'Will come back again', userAvatar: 'https://ui-avatars.com/api/?name=User&background=random' },
    { id: 'default-5', imageUrl: '/temple-images/大昭寺.png', title: 'Beautiful', description: 'Stunning animation', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Art Lover', userComment: 'Beautiful design', userAvatar: 'https://ui-avatars.com/api/?name=Art&background=random' },
    { id: 'default-6', imageUrl: '/temple-images/白马寺.jpg', title: 'Incredible', description: 'Beyond expectations', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Pilgrim', userComment: 'Truly special', userAvatar: 'https://ui-avatars.com/api/?name=Pil&background=random' },
    { id: 'default-7', imageUrl: '/temple-images/灵山大佛.jpg', title: 'Warm Blessings', description: 'Felt the warmth', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Warm Heart', userComment: 'Very comforting', userAvatar: 'https://ui-avatars.com/api/?name=WH&background=random' },
    { id: 'default-8', imageUrl: '/temple-images/法门寺.jpg', title: 'Unique', description: 'One of a kind', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Explorer', userComment: 'Unique experience', userAvatar: 'https://ui-avatars.com/api/?name=Ex&background=random' },
    { id: 'default-9', imageUrl: '/temple-images/南普陀寺.jpg', title: 'Divine', description: 'A truly spiritual journey', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Devotee', userComment: 'Feeling blessed', userAvatar: 'https://ui-avatars.com/api/?name=De&background=random' },
    { id: 'default-10', imageUrl: '/temple-images/南华寺.webp', title: 'Magical', description: 'Magical experience', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Magic Seeker', userComment: 'Absolutely wonderful', userAvatar: 'https://ui-avatars.com/api/?name=MS&background=random' },
    { id: 'default-11', imageUrl: '/temple-images/卧佛寺.webp', title: 'Serene', description: 'Perfectly serene', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Peace Finder', userComment: 'Inner peace found', userAvatar: 'https://ui-avatars.com/api/?name=PF&background=random' },
    { id: 'default-12', imageUrl: '/temple-images/金顶华藏寺.jpg', title: 'Heavenly', description: 'Heavenly experience', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Sky Walker', userComment: 'Absolutely stunning', userAvatar: 'https://ui-avatars.com/api/?name=SW&background=random' },
    { id: 'default-13', imageUrl: '/temple-images/国清寺.webp', title: 'Amazing', description: 'Beyond amazing', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Awestruck', userComment: 'Mind-blowing', userAvatar: 'https://ui-avatars.com/api/?name=AW&background=random' },
    { id: 'default-14', imageUrl: '/temple-images/隆兴寺.webp', title: 'Fantastic', description: 'Fantastic service', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Happy Client', userComment: 'Best experience ever', userAvatar: 'https://ui-avatars.com/api/?name=HC&background=random' },
    { id: 'default-15', imageUrl: '/temple-images/金山寺.webp', title: 'Wonderful', description: 'Simply wonderful', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Joyful Soul', userComment: 'Full of joy', userAvatar: 'https://ui-avatars.com/api/?name=JS&background=random' },
    { id: 'default-16', imageUrl: '/temple-images/佛顶宫.webp', title: 'Divine Blessing', description: 'Received divine blessing', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Blessed One', userComment: 'Grateful forever', userAvatar: 'https://ui-avatars.com/api/?name=BO&background=random' },
    { id: 'default-17', imageUrl: '/temple-images/地藏禅寺.jpg', title: 'Heartfelt', description: 'Deeply heartfelt', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Deep Thinker', userComment: 'Touched my soul', userAvatar: 'https://ui-avatars.com/api/?name=DT&background=random' },
    { id: 'default-18', imageUrl: '/temple-images/塔院寺.png', title: 'Elevating', description: 'Soul elevating', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Sky High', userComment: 'Elevated my spirit', userAvatar: 'https://ui-avatars.com/api/?name=SH&background=random' },
    { id: 'default-19', imageUrl: '/temple-images/fHPlMoqxg.jpg', title: 'Transformative', description: 'Life-transforming', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Transformed', userComment: 'Changed my life', userAvatar: 'https://ui-avatars.com/api/?name=TF&background=random' },
    { id: 'default-20', imageUrl: '/temple-images/fHPvQoQPv.jpg', title: 'Miraculous', description: 'Miraculous experience', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Miracle Believer', userComment: 'Witnessed a miracle', userAvatar: 'https://ui-avatars.com/api/?name=MB&background=random' }
  ];

  const displayComments = comments.length > 0 ? comments : defaultComments;
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
