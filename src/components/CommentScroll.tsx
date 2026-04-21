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
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const commentsPerGroup = 5;
  const commentWidth = 220;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const section = document.getElementById('community-shares-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const loadComments = async () => {
    console.log('loadComments function called');
    try {
      console.log('Fetching comments from database...');
      const response = await fetch('/api/public/comments', { cache: 'no-store' });
      console.log('Response status:', response.status);
      if (response.ok) {
        const dbComments = await response.json();
        console.log('Database comments:', dbComments);
        setComments(dbComments);
        try {
          localStorage.setItem('cyberBuddhaComments', JSON.stringify(dbComments));
        } catch (localStorageError) {
          console.error('Error saving comments to localStorage:', localStorageError);
        }
        setCurrentGroupIndex(0);
        console.log('Comments updated from database');
        return;
      } else {
        console.error('Failed to fetch comments from database:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching comments from database:', error);
    }
    
    console.log('Fetching comments from localStorage...');
    const storedComments = localStorage.getItem('cyberBuddhaComments');
    if (storedComments) {
      try {
        const parsedComments = JSON.parse(storedComments);
        const formattedComments = parsedComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        console.log('LocalStorage comments:', formattedComments);
        setComments(formattedComments);
        setCurrentGroupIndex(0);
        console.log('Comments updated from localStorage');
      } catch (parseError) {
        console.error('Error parsing comments from localStorage:', parseError);
        setComments([]);
      }
    } else {
      console.log('No comments found in localStorage');
      setComments([]);
    }
  };
  
  useEffect(() => {
    // @ts-ignore
    window.loadComments = loadComments;
    console.log('loadComments function exposed to window');
    
    return () => {
      // @ts-ignore
      delete window.loadComments;
      console.log('loadComments function removed from window');
    };
  }, [loadComments]);

  useEffect(() => {
    if (!isVisible) return;
    
    loadComments();
    window.addEventListener('storage', loadComments);
    const interval = setInterval(loadComments, 30000);

    return () => {
      window.removeEventListener('storage', loadComments);
      clearInterval(interval);
    };
  }, [isVisible]);

  useEffect(() => {
    const handleCommentAdded = () => {
      loadComments();
    };

    window.addEventListener('commentAdded', handleCommentAdded as EventListener);

    return () => {
      window.removeEventListener('commentAdded', handleCommentAdded as EventListener);
    };
  }, []);

  const totalGroups = Math.ceil(comments.length / commentsPerGroup);

  useEffect(() => {
    if (comments.length <= commentsPerGroup) return;

    const interval = setInterval(() => {
      setCurrentGroupIndex((prevIndex) => {
        return (prevIndex + 1) % totalGroups;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [comments.length, commentsPerGroup, totalGroups]);

  const handleGroupChange = (index: number) => {
    if (index === currentGroupIndex || isAnimating) return;
    setIsAnimating(true);
    setCurrentGroupIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

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
    }
  ];

  const displayComments = comments.length > 0 ? comments : defaultComments;
  const visibleGroupCount = Math.min(commentsPerGroup, displayComments.length);
  const translateX = -currentGroupIndex * visibleGroupCount * commentWidth;

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 max-w-7xl mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      <div 
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: '280px' }}
      >
        <div 
          className="flex gap-3 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${translateX}px)`,
            width: `${Math.ceil(displayComments.length / commentsPerGroup) * visibleGroupCount * commentWidth}px`,
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
      
      {comments.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-[#F5F5F7]/70 text-sm">No comments yet. Be the first to share!</p>
        </div>
      )}
      
      {displayComments.length > commentsPerGroup && (
        <div className="flex justify-center gap-1 mt-3">
          {Array(Math.ceil(displayComments.length / commentsPerGroup)).fill(0).map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentGroupIndex ? 'bg-[#8676B6] w-4' : 'bg-[#8676B6]/30'}`}
              onClick={() => handleGroupChange(index)}
              aria-label={`Go to comment group ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentScroll;