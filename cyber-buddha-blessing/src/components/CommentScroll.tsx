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
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 overflow-hidden max-w-md mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      {/* 评论滚动容器 */}
      <div className="relative overflow-hidden">
        {/* 单个评论卡片 - 带平滑过渡动画 */}
        <div 
          className="transition-all duration-500 ease-in-out transform"
          style={{
            opacity: 1,
            transform: 'translateX(0)',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div className="grid grid-cols-1 gap-3">
            {/* 分享的图片 */}
            <div className="relative w-full h-24 overflow-hidden rounded-lg border border-[#8676B6]/30">
              <NextImage
                src={currentComment.imageUrl}
                alt={currentComment.title}
                fill
                className="object-contain"
              />
            </div>
            
            {/* 评论内容和用户信息 */}
            <div className="space-y-2">
              {/* 用户信息和头像 */}
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#8676B6]/30">
                  <img 
                    src={currentComment.userAvatar} 
                    alt={currentComment.userName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-[#F5F5F7]">{currentComment.userName}</span>
                  <span className="text-[#F5F5F7]/50 text-[10px]">
                    {new Date(currentComment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* 分享标题 */}
              <h4 className="text-sm font-semibold text-[#8676B6] line-clamp-1">{currentComment.title}</h4>
              
              {/* 用户自定义评论 */}
              {currentComment.userComment && (
                <div className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg p-2">
                  <p className="text-[#F5F5F7]/80 italic text-xs line-clamp-2">"{currentComment.userComment}"</p>
                </div>
              )}
              
              {/* 原始描述 */}
              <p className="text-[#F5F5F7]/70 text-xs line-clamp-1">{currentComment.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 指示器 - 缩小版本 */}
      <div className="flex justify-center gap-1 mt-3">
        {comments.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#8676B6] w-4' : 'bg-[#8676B6]/30'}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to comment ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentScroll;