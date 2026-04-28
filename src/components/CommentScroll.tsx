'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../lib/imageUtils';
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const commentWidth = 180; // 每个评论的宽度
  const containerRef = useRef<HTMLDivElement>(null);

  // 移除IntersectionObserver，提前加载评论
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    // console.log('loadComments function called');
    setIsLoading(true);
    setLoadError(null);
    
    // 立即尝试从localStorage加载缓存，确保快速显示内容
    const storedComments = localStorage.getItem('cyberBuddhaComments');
    if (storedComments) {
      try {
        const parsedComments = JSON.parse(storedComments);
        const formattedComments = parsedComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        // console.log('LocalStorage comments (preload):', formattedComments);
        setComments(formattedComments);
        setScrollPosition(0);
      } catch (parseError) {
        // console.error('Error parsing comments from localStorage:', parseError);
      }
    }
    
    try {
      // console.log('Fetching comments from database...');
      // 添加超时控制，减少超时时间到3秒
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
      
      const response = await fetch('/api/public/comments', {
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      // console.log('Response status:', response.status);
      
      if (response.ok) {
        const dbComments = await response.json();
        // console.log('Database comments:', dbComments);
        setComments(dbComments);
        try {
          localStorage.setItem('cyberBuddhaComments', JSON.stringify(dbComments));
        } catch (localStorageError) {
          // console.error('Error saving comments to localStorage:', localStorageError);
        }
        setScrollPosition(0);
        // console.log('Comments updated from database');
        setIsLoading(false);
        return;
      } else {
        // console.error('Failed to fetch comments from database:', await response.text());
        setLoadError('Database connection failed, using cached comments');
      }
    } catch (error) {
      // console.error('Error fetching comments from database:', error);
      setLoadError('Network error, using cached or default comments');
    }
    
    // 如果没有缓存，使用默认评论
    if (comments.length === 0) {
      // console.log('No comments found, using default comments');
      setLoadError('No comments available, using default');
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    // @ts-ignore
    window.loadComments = loadComments;
    // console.log('loadComments function exposed to window');
    
    return () => {
      // @ts-ignore
      delete window.loadComments;
      // console.log('loadComments function removed from window');
    };
  }, [loadComments]);

  useEffect(() => {
    window.addEventListener('storage', loadComments);
    const interval = setInterval(loadComments, 30000);

    return () => {
      window.removeEventListener('storage', loadComments);
      clearInterval(interval);
    };
  }, [loadComments]);

  const defaultComments: Comment[] = [
    {
      id: 'default-1',
      imageUrl: '/temple-images/灵隐寺.webp',
      title: 'My First Blessing',
      description: 'Received my digital blessing today!',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(),
      userName: 'Cyber Monk',
      userComment: 'May peace and wisdom fill your heart',
      userAvatar: 'https://ui-avatars.com/api/?name=Monk&background=random'
    },
    {
      id: 'default-2',
      imageUrl: '/temple-images/南华寺.webp',
      title: 'Digital Enlightenment',
      description: 'The cyber blessing experience was amazing!',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(Date.now() - 86400000),
      userName: 'Tech Seeker',
      userComment: 'A perfect blend of technology and spirituality',
      userAvatar: 'https://ui-avatars.com/api/?name=Tech&background=random'
    },
    {
      id: 'default-3',
      imageUrl: '/temple-images/少林寺.webp',
      title: 'Blessed Device',
      description: 'My phone now has a spiritual aura',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(Date.now() - 172800000),
      userName: 'Digital Pilgrim',
      userComment: 'Every time I use my device, I feel blessed',
      userAvatar: 'https://ui-avatars.com/api/?name=Pilgrim&background=random'
    },
    {
      id: 'default-4',
      imageUrl: '/temple-images/寒山寺.webp',
      title: 'Cyber Blessing',
      description: 'A unique spiritual experience in the digital age',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(Date.now() - 259200000),
      userName: 'Spiritual Coder',
      userComment: 'Technology meets transcendence',
      userAvatar: 'https://ui-avatars.com/api/?name=Coder&background=random'
    },
    {
      id: 'default-5',
      imageUrl: '/temple-images/灵山大佛.jpg',
      title: 'Enlightened Technology',
      description: 'My laptop now radiates positive energy',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(Date.now() - 345600000),
      userName: 'Zen Developer',
      userComment: 'Work with purpose and peace',
      userAvatar: 'https://ui-avatars.com/api/?name=Zen&background=random'
    },
    {
      id: 'default-6',
      imageUrl: '/temple-images/灵隐寺.webp',
      title: 'Spiritual Upgrade',
      description: 'My keyboard now has a divine touch',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(Date.now() - 432000000),
      userName: 'Keyboard Monk',
      userComment: 'Every keystroke feels blessed',
      userAvatar: 'https://ui-avatars.com/api/?name=Keyboard&background=random'
    },
    {
      id: 'default-7',
      imageUrl: '/temple-images/南华寺.webp',
      title: 'Digital Peace',
      description: 'My headphones now play spiritual sounds',
      pageUrl: 'https://cyber-buddha.blessing',
      createdAt: new Date(Date.now() - 518400000),
      userName: 'Audio Seeker',
      userComment: 'Music with a spiritual dimension',
      userAvatar: 'https://ui-avatars.com/api/?name=Audio&background=random'
    }
  ];

  const displayComments = comments.length > 0 ? comments : defaultComments;
  const containerWidth = 900; // 容器宽度，显示5个评论
  const scrollSpeed = 10; // 滚动速度，像素/秒，增加速度使效果更明显

  // 连续滚动效果
  useEffect(() => {
    if (displayComments.length <= 5) return; // 少于等于5个评论时不需要滚动

    const interval = setInterval(() => {
      setScrollPosition((prevPosition) => {
        const totalWidth = displayComments.length * (commentWidth + 12); // 总宽度 = 评论数量 * (评论宽度 + 间距)
        const newPosition = prevPosition + scrollSpeed / 60; // 60fps
        return newPosition >= totalWidth ? 0 : newPosition;
      });
    }, 1000 / 60); // 60fps

    return () => clearInterval(interval);
  }, [displayComments.length, commentWidth, scrollSpeed]);

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 max-w-7xl mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[280px]">
          <div className="w-10 h-10 border-4 border-[#8676B6]/30 border-t-[#8676B6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div 
            ref={containerRef}
            className="relative overflow-x-hidden overflow-y-hidden"
            style={{ height: '280px' }}
          >
            <div 
              className="flex gap-3 transition-transform duration-0"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
              }}
            >
              {displayComments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg p-3 transition-all duration-300 hover:shadow-lg flex-shrink-0"
                  style={{ width: `${commentWidth}px` }}
                >
                  <div className="relative w-full h-32 overflow-hidden rounded-md border border-[#8676B6]/30 mb-3">
                    <ImageWithFallback
                      src={getImageUrl(comment.imageUrl)}
                      alt={comment.title}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#8676B6]/30 flex-shrink-0">
                        <img 
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
                    
                    <h4 className="text-sm font-semibold text-[#8676B6] line-clamp-1">{comment.title}</h4>
                    
                    {comment.userComment && (
                      <div className="bg-[#1D1D1F]/70 border border-[#8676B6]/20 rounded-md p-2">
                        <p className="text-[#F5F5F7]/80 italic text-xs line-clamp-2">"{comment.userComment}"</p>
                      </div>
                    )}
                    
                    <p className="text-[#F5F5F7]/70 text-xs line-clamp-1">{comment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {loadError && (
            <div className="mt-2 text-center">
              <p className="text-[#FFD700]/70 text-xs">{loadError}</p>
            </div>
          )}
          
          {displayComments.length === 0 && (
            <div className="mt-4 text-center">
              <p className="text-[#F5F5F7]/70 text-sm">No comments yet. Be the first to share!</p>
            </div>
          )}
          

        </>
      )}
    </div>
  );
};

export default CommentScroll;