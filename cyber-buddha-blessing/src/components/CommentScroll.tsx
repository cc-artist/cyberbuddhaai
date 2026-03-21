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
      
      {/* 评论网格布局 - 同时展示多个评论 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {comments.map((comment) => (
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
  );
};

export default CommentScroll;