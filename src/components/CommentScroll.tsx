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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const commentWidth = 180;
  const containerRef = useRef<HTMLDivElement>(null);

  // 从数据库和localStorage获取评论数据
  const loadComments = async () => {
    console.log('loadComments function called');
    
    // 首先尝试从localStorage获取评论，作为备用
    const getLocalStorageComments = () => {
      console.log('Fetching comments from localStorage...');
      try {
        const storedComments = localStorage.getItem('cyberBuddhaComments');
        if (storedComments) {
          const parsedComments = JSON.parse(storedComments);
          const formattedComments = parsedComments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt)
          }));
          console.log('LocalStorage comments:', formattedComments);
          return formattedComments;
        } else {
          console.log('No comments found in localStorage');
          return [];
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
      }
    };
    
    const localComments = getLocalStorageComments();
    if (localComments.length > 0) {
      setComments(localComments);
      console.log('Initial comments loaded from localStorage');
    }
    
    try {
      console.log('Fetching comments from database...');
      const response = await fetch('/api/public/comments', { cache: 'no-store' });
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const dbComments = await response.json();
        console.log('Database comments:', dbComments);
        
        const commentsArray = Array.isArray(dbComments) ? dbComments : [];
        const formattedComments = commentsArray.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        
        if (formattedComments.length > 0) {
          setComments(formattedComments);
          console.log('Comments updated from database');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching comments from database:', error);
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

  // 获取当前要显示的7个评论，确保更丰富的展示
  const getVisibleComments = () => {
    const result = [];
    const displayCount = Math.min(7, displayComments.length);
    for (let i = 0; i < displayCount; i++) {
      const index = (currentIndex + i) % displayComments.length;
      result.push({
        comment: displayComments[index],
        index: i
      });
    }
    return result;
  };

  // 改进的动画效果：每2秒平滑滚动
  useEffect(() => {
    console.log('useEffect called, displayComments length:', displayComments.length);
    
    if (displayComments.length <= 7) {
      console.log('displayComments <= 7, skipping automatic animation');
      return;
    }

    const interval = setInterval(() => {
      console.log('Starting animation sequence...');
      setAnimationPhase(1);
      setIsAnimating(true);
      
      setTimeout(() => {
        console.log('Updating currentIndex...');
        setCurrentIndex(prev => (prev + 1) % displayComments.length);
        setAnimationPhase(2);
        
        setTimeout(() => {
          console.log('Finishing animation...');
          setIsAnimating(false);
          setAnimationPhase(0);
        }, 400);
      }, 300);
    }, 2000);

    return () => {
      console.log('Clearing interval...');
      clearInterval(interval);
    };
  }, [displayComments.length, displayComments]);

  console.log('Rendering CommentScroll, currentIndex:', currentIndex, 'isAnimating:', isAnimating, 'animationPhase:', animationPhase);

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 max-w-7xl mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      <div ref={containerRef} className="relative overflow-hidden" style={{ height: '280px' }}>
        <div className="flex gap-3">
          {getVisibleComments().map(({ comment, index }) => (
            <div 
              key={`${comment.id}-${currentIndex}`}
              className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg p-3 hover:shadow-lg flex-shrink-0"
              style={{ 
                width: `${commentWidth}px`,
                opacity: animationPhase === 1 ? 0.3 : 1,
                transform: animationPhase === 1 ? 'scale(0.95)' : animationPhase === 2 ? 'scale(1.02)' : 'scale(1)',
                transition: 'opacity 0.3s ease-in-out, transform 0.4s ease-in-out, box-shadow 0.3s ease-in-out',
                boxShadow: animationPhase === 2 ? '0 0 20px rgba(134, 118, 182, 0.3)' : 'none'
              }}
            >
              <div className="relative w-full h-32 overflow-hidden rounded-md border border-[#8676B6]/30 mb-3">
                <ImageWithFallback
                  src={comment.imageUrl}
                  alt={comment.title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {/* 闪烁光效 */}
                {animationPhase === 2 && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent animate-pulse"
                  />
                )}
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
