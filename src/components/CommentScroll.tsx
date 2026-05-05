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
        
        const formattedComments = dbComments.map((comment: any) => ({
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
    { id: 'default-8', imageUrl: '/temple-images/法门寺.jpg', title: 'Unique', description: 'One of a kind', pageUrl: 'https://cyber-buddha.blessing', createdAt: new Date(), userName: 'Explorer', userComment: 'Unique experience', userAvatar: 'https://ui-avatars.com/api/?name=Ex&background=random' }
  ];

  const displayComments = comments.length > 0 ? comments : defaultComments;

  // 获取当前要显示的5个评论
  const getVisibleComments = () => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % displayComments.length;
      result.push({
        comment: displayComments[index],
        index: i
      });
    }
    return result;
  };

  // 每1.5秒闪现更新评论
  useEffect(() => {
    console.log('useEffect called, displayComments length:', displayComments.length);
    
    if (displayComments.length <= 5) {
      console.log('displayComments <= 5, skipping animation');
      return;
    }

    const interval = setInterval(() => {
      console.log('Starting flash animation...');
      setIsAnimating(true);
      
      setTimeout(() => {
        console.log('Updating currentIndex...');
        setCurrentIndex(prev => (prev + 1) % displayComments.length);
        
        setTimeout(() => {
          console.log('Finishing flash animation...');
          setIsAnimating(false);
        }, 300);
      }, 200);
    }, 1500);

    return () => {
      console.log('Clearing interval...');
      clearInterval(interval);
    };
  }, [displayComments.length, displayComments]);

  console.log('Rendering CommentScroll, currentIndex:', currentIndex, 'isAnimating:', isAnimating);

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
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out'
              }}
            >
              <div className="relative w-full h-32 overflow-hidden rounded-md border border-[#8676B6]/30 mb-3">
                <ImageWithFallback
                  src={comment.imageUrl}
                  alt={comment.title}
                  className="absolute inset-0 w-full h-full object-contain"
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
