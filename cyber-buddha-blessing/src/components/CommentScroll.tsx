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
  const commentsPerGroup = 3; // 每组显示的评论数量，根据需求改为3个

  // 从数据库和localStorage获取评论数据
  const loadComments = async () => {
    console.log('loadComments function called');
    try {
      // 优先从数据库获取评论
      console.log('Fetching comments from database...');
      const response = await fetch('/api/public/comments', { cache: 'no-store' });
      console.log('Response status:', response.status);
      if (response.ok) {
        const dbComments = await response.json();
        console.log('Database comments:', dbComments);
        setComments(dbComments);
        // 将数据库评论保存到localStorage作为备份
        try {
          localStorage.setItem('cyberBuddhaComments', JSON.stringify(dbComments));
        } catch (localStorageError) {
          console.error('Error saving comments to localStorage:', localStorageError);
        }
        // 重置当前组索引
        setCurrentGroupIndex(0);
        console.log('Comments updated from database');
        return;
      } else {
        console.error('Failed to fetch comments from database:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching comments from database:', error);
    }
    
    // 数据库获取失败时，从localStorage获取
    console.log('Fetching comments from localStorage...');
    const storedComments = localStorage.getItem('cyberBuddhaComments');
    if (storedComments) {
      try {
        const parsedComments = JSON.parse(storedComments);
        // 转换createdAt字符串为Date对象
        const formattedComments = parsedComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        console.log('LocalStorage comments:', formattedComments);
        setComments(formattedComments);
        // 重置当前组索引
        setCurrentGroupIndex(0);
        console.log('Comments updated from localStorage');
      } catch (parseError) {
        console.error('Error parsing comments from localStorage:', parseError);
        setComments([]);
      }
    } else {
      console.log('No comments found in localStorage');
      // 如果localStorage也没有评论，设置为空数组
      setComments([]);
    }
  };
  
  // 将loadComments函数暴露到window对象上，方便其他组件调用
  useEffect(() => {
    // @ts-ignore
    window.loadComments = loadComments;
    console.log('loadComments function exposed to window');
    
    return () => {
      // 清理window对象上的函数
      // @ts-ignore
      delete window.loadComments;
      console.log('loadComments function removed from window');
    };
  }, [loadComments]);

  useEffect(() => {
    loadComments();
    // 监听localStorage变化
    window.addEventListener('storage', loadComments);
    // 添加轮询机制，每30秒刷新一次评论
    const interval = setInterval(loadComments, 30000);

    return () => {
      window.removeEventListener('storage', loadComments);
      clearInterval(interval);
    };
  }, []);

  // 添加评论后手动刷新（通过自定义事件）
  useEffect(() => {
    const handleCommentAdded = () => {
      loadComments();
    };

    window.addEventListener('commentAdded', handleCommentAdded as EventListener);

    return () => {
      window.removeEventListener('commentAdded', handleCommentAdded as EventListener);
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

  // 添加默认评论，确保评论区域始终可见
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

  // 使用实际评论或默认评论
  const displayComments = comments.length > 0 ? comments : defaultComments;

  // 计算当前显示的评论组
  const getCurrentComments = () => {
    const startIndex = currentGroupIndex * commentsPerGroup;
    return displayComments.slice(startIndex, startIndex + commentsPerGroup);
  };

  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-4 overflow-hidden max-w-7xl mx-auto">
      <h3 className="text-sm font-bold mb-3 text-center text-[#F5F5F7]">Community Shares</h3>
      
      {/* 评论滚动容器 - 带平滑过渡动画 */}
      <div className="relative overflow-hidden">
        {/* 当前显示的评论组 */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-500 ease-in-out transform"
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
                    <NextImage 
                      src={comment.userAvatar} 
                      alt={comment.userName} 
                      fill
                      unoptimized={true}
                      className="object-cover" 
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
      
      {/* 提示信息 */}
      {comments.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-[#F5F5F7]/70 text-sm">No comments yet. Be the first to share!</p>
        </div>
      )}
      
      {/* 指示器 - 显示当前评论组 */}
      {displayComments.length > commentsPerGroup && (
        <div className="flex justify-center gap-1 mt-3">
          {Array(Math.ceil(displayComments.length / commentsPerGroup)).fill(0).map((_, index) => (
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