'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';

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

  // 从localStorage获取评论数据
  useEffect(() => {
    const loadComments = () => {
      const storedComments = localStorage.getItem('cyberBuddhaComments');
      if (storedComments) {
        const parsedComments = JSON.parse(storedComments);
        // 转换createdAt字符串为Date对象
        const formattedComments = parsedComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        setComments(formattedComments);
      }
    };

    loadComments();
    // 监听localStorage变化
    window.addEventListener('storage', loadComments);

    return () => {
      window.removeEventListener('storage', loadComments);
    };
  }, []);

  // 自动轮播评论
  useEffect(() => {
    if (comments.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % comments.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [comments]);

  if (comments.length === 0) {
    return (
      <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-8 text-center">
        <p className="text-[#F5F5F7]/70">No comments yet. Be the first to share!</p>
      </div>
    );
  }

  const currentComment = comments[currentIndex];

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-8 overflow-hidden">
      <h3 className="text-xl font-bold mb-6 text-center text-[#F5F5F7]">Community Shares</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* 分享的图片 */}
        <div className="relative aspect-square overflow-hidden rounded-lg border border-[#8676B6]/30">
          <NextImage
            src={currentComment.imageUrl}
            alt={currentComment.title}
            fill
            className="object-contain"
          />
        </div>
        
        {/* 评论内容和用户信息 */}
        <div className="space-y-4">
          {/* 用户信息和头像 */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#8676B6]/30">
              <img 
                src={currentComment.userAvatar} 
                alt={currentComment.userName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#F5F5F7]">{currentComment.userName}</h4>
              <div className="flex items-center text-xs text-[#F5F5F7]/50">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {new Date(currentComment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* 分享标题 */}
          <h4 className="text-lg font-semibold text-[#8676B6]">{currentComment.title}</h4>
          
          {/* 用户自定义评论 */}
          {currentComment.userComment && (
            <div className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg p-3">
              <p className="text-[#F5F5F7]/80 italic">"{currentComment.userComment}"</p>
            </div>
          )}
          
          {/* 原始描述 */}
          <p className="text-[#F5F5F7]/70">{currentComment.description}</p>
        </div>
      </div>
      
      {/* 指示器 */}
      <div className="flex justify-center gap-2 mt-6">
        {comments.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#8676B6] w-6' : 'bg-[#8676B6]/30'}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to comment ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentScroll;