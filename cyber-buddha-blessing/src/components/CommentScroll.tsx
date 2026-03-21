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
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const commentsPerGroup = 2; // 每组显示的评论数量

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
        // 重置当前组索引
        setCurrentGroupIndex(0);
      }
    };

    loadComments();
    // 监听localStorage变化
    window.addEventListener('storage', loadComments);

    return () => {
      window.removeEventListener('storage', loadComments);
    };
  }, []);

  // 自动轮播评论组
  useEffect(() => {
    if (comments.length <= commentsPerGroup) return;

    const interval = setInterval(() => {
      setCurrentGroupIndex((prevIndex) => {
        const totalGroups = Math.ceil(comments.length / commentsPerGroup);
        return (prevIndex + 1) % totalGroups;
      });
    }, 5000); // 每5秒切换一次

    return () => clearInterval(interval);
  }, [comments, commentsPerGroup]);

  // 计算当前显示的评论组
  const getCurrentComments = () => {
    const startIndex = currentGroupIndex * commentsPerGroup;
    return comments.slice(startIndex, startIndex + commentsPerGroup);
  };

  if (comments.length === 0) {
    return (
      <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 text-center max-w-md mx-auto">
        <p className="text-[#F5F5F7]/70 text-sm">No comments yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 overflow-hidden max-w-md mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      {/* 评论滚动容器 - 带平滑过渡动画 */}
      <div className="relative overflow-hidden">
        {/* 当前显示的评论组 */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-500 ease-in-out transform"
          style={{
            opacity: 1,
            transform: 'translateY(0)',
            position: 'relative',
            zIndex: 10
          }}
        >
          {getCurrentComments().map((comment) => (
            <div 
              key={comment.id} 
              className="bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg p-3 transition-all duration-300 hover:shadow-lg"
            >
              {/* 分享的图片 */}
              <div className="relative w-full h-16 overflow-hidden rounded-md border border-[#8676B6]/30 mb-2">
                <NextImage
                  src={comment.imageUrl}
                  alt={comment.title}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* 评论内容和用户信息 */}
              <div className="space-y-1">
                {/* 用户信息和头像 */}
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#8676B6]/30">
                    <img 
                      src={comment.userAvatar} 
                      alt={comment.userName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-medium text-[#F5F5F7]">{comment.userName}</span>
                    <span className="text-[#F5F5F7]/50 text-[8px]">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* 分享标题 */}
                <h4 className="text-xs font-semibold text-[#8676B6] line-clamp-1">{comment.title}</h4>
                
                {/* 用户自定义评论 */}
                {comment.userComment && (
                  <div className="bg-[#1D1D1F]/70 border border-[#8676B6]/20 rounded-md p-1">
                    <p className="text-[#F5F5F7]/80 italic text-[10px] line-clamp-1">"{comment.userComment}"</p>
                  </div>
                )}
                
                {/* 原始描述 */}
                <p className="text-[#F5F5F7]/70 text-[10px] line-clamp-1">{comment.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 指示器 - 显示当前评论组 */}
      {comments.length > commentsPerGroup && (
        <div className="flex justify-center gap-1 mt-3">
          {Array(Math.ceil(comments.length / commentsPerGroup)).fill(0).map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentGroupIndex ? 'bg-[#8676B6] w-4' : 'bg-[#8676B6]/30'}`}
              onClick={() => setCurrentGroupIndex(index)}
              aria-label={`Go to comment group ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentScroll;