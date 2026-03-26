'use client';

import React from 'react';

interface SocialShareProps {
  imageUrl: string;
  title: string;
  description: string;
  pageUrl: string;
}

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

const SocialShare: React.FC<SocialShareProps> = ({ imageUrl, title, description, pageUrl }) => {
  // 模态框状态
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // 用户输入状态
  const [userName, setUserName] = React.useState('');
  const [userComment, setUserComment] = React.useState('');
  const [userAvatar, setUserAvatar] = React.useState<string>('https://ui-avatars.com/api/?name=Guest&background=random');
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  // 预设的像素头像选项
  const pixelAvatars = [
    'https://ui-avatars.com/api/?name=😊&background=random',
    'https://ui-avatars.com/api/?name=🙏&background=random',
    'https://ui-avatars.com/api/?name=✨&background=random',
    'https://ui-avatars.com/api/?name=🌟&background=random',
    'https://ui-avatars.com/api/?name=🌸&background=random',
    'https://ui-avatars.com/api/?name=🍀&background=random',
    'https://ui-avatars.com/api/?name=🦋&background=random',
    'https://ui-avatars.com/api/?name=🌈&background=random'
  ];

  // 处理头像文件选择
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理分享到平台
  const shareToPlatform = (platform: string) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);
    
    switch (platform) {
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram不支持直接分享URL，需要引导用户下载图片后手动分享
        shareUrl = `https://www.instagram.com/`;
        break;
      case 'weixin':
        shareUrl = `https://servicewechat.com/share?url=${encodedUrl}&title=${encodedTitle}&desc=${encodedDesc}`;
        break;
      case 'comments':
        // 显示评论模态框
        setIsModalOpen(true);
        return;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // 保存评论到数据库和localStorage
  const saveComment = async () => {
    try {
      console.log('saveComment function called');
      console.log('Current state:', { userName, userComment });
      
      // 检查用户名和评论是否为空
      if (!userName.trim()) {
        console.log('Username is empty');
        alert('Please enter your username!');
        return;
      }
      
      if (!userComment.trim()) {
        console.log('Comment is empty');
        alert('Please enter your comment!');
        return;
      }

      // 检查是否有结果图 - 更严格的检查
      console.log('Checking imageUrl:', imageUrl);
      if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'undefined' || imageUrl === 'null') {
        console.log('No valid imageUrl provided');
        alert('点击生成和下载DIGITAL BLESSING结果后才能分享完整的DIGITAL BLESSING结果图');
        return;
      }

      console.log('Creating new comment:', {
        userName: userName.trim(),
        userComment: userComment.trim(),
        imageUrl,
        title,
        description,
        pageUrl
      });

      const newComment: Comment = {
        id: Date.now().toString(),
        imageUrl,
        title,
        description,
        pageUrl,
        createdAt: new Date(),
        userName: userName.trim(),
        userComment: userComment.trim(),
        userAvatar
      };

      // 保存到localStorage - 增加错误处理和降级方案
      try {
        // 先检查localStorage是否可用
        const testKey = 'test_' + Date.now();
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        
        // localStorage可用，保存评论
        const comments = JSON.parse(localStorage.getItem('cyberBuddhaComments') || '[]');
        comments.push(newComment);
        localStorage.setItem('cyberBuddhaComments', JSON.stringify(comments));
        console.log('Comment saved to localStorage:', newComment);
      } catch (localStorageError) {
        console.error('Error saving comment to localStorage:', localStorageError);
        // localStorage不可用，跳过localStorage保存，直接保存到数据库
        console.log('localStorage not available, skipping localStorage save');
      }
      
      // 保存到数据库
      try {
        console.log('Saving comment to database...');
        const response = await fetch('/api/public/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newComment),
        });

        console.log('Database response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Database response error:', errorText);
          // 数据库保存失败时，仍然继续执行后续逻辑
          console.log('Database save failed, but comment processing continues');
        } else {
          const savedComment = await response.json();
          console.log('Comment saved to database:', savedComment);
        }
      } catch (databaseError) {
        console.error('Error saving comment to database:', databaseError);
        // 数据库保存失败时，仍然继续执行后续逻辑
        console.log('Database save failed, but comment processing continues');
      }
    
      // 触发自定义事件，通知CommentScroll组件刷新评论
      console.log('Dispatching commentAdded event');
      window.dispatchEvent(new CustomEvent('commentAdded'));
      
      // 直接调用CommentScroll组件的loadComments函数（如果存在）
      // 这是一个备用方案，确保评论立即显示
      if ((window as any).loadComments) {
        console.log('Calling window.loadComments() directly');
        (window as any).loadComments();
      }
      
      // 触发storage事件，通知其他标签页
      window.dispatchEvent(new Event('storage'));
      
      // 重置状态并关闭模态框
      console.log('Closing modal and resetting state');
      setIsModalOpen(false);
      setUserName('');
      setUserComment('');
      setUserAvatar('https://ui-avatars.com/api/?name=Guest&background=random');
      setAvatarFile(null);
      
      alert('Successfully shared to comments section!');
      // 提示用户可以在首页查看评论
      setTimeout(() => {
        alert('You can now see your comment on the homepage!');
      }, 1000);
    } catch (error) {
      console.error('Error in saveComment function:', error);
      alert('Failed to share comment. Please try again!');
    }
  };
  
  return (
    <div>
      {/* 分享按钮 */}
      <div className="flex gap-3 mt-4">
        <button 
          onClick={() => shareToPlatform('x')} 
          className="p-2 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-colors duration-300 flex items-center justify-center"
          aria-label="Share to X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
        
        <button 
          onClick={() => shareToPlatform('facebook')} 
          className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors duration-300 flex items-center justify-center"
          aria-label="Share to Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
          </svg>
        </button>
        
        <button 
          onClick={() => shareToPlatform('instagram')} 
          className="p-2 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90 transition-opacity duration-300 flex items-center justify-center"
          aria-label="Share to Instagram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"/>
          </svg>
        </button>
        
        <button 
          onClick={() => shareToPlatform('weixin')} 
          className="p-2 rounded-full bg-[#07C160] text-white hover:bg-[#07C160]/90 transition-colors duration-300 flex items-center justify-center"
          aria-label="Share to WeChat"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.662 13.833c-.35-2.976.97-5.183 3.247-6.685-.173-1.172-.934-2.14-1.965-2.586 1.179-.405 1.853-.806 1.853-1.596 0-1.146-1.137-1.82-2.388-1.82-1.855 0-3.533 1.485-3.533 3.892 0 .58.091 1.231.37 1.777-2.941-.146-5.644-1.503-7.547-3.664-.305.533-.483 1.12-.483 1.768 0 1.254.64 2.307 1.617 2.935-.601-.016-1.163-.19-1.655-.496v.046c0 1.856 1.32 3.404 3.07 3.756-.316.086-.667.136-1.033.136-.253 0-.503-.026-.74-.076.507 1.556 2.018 2.688 3.853 2.728-1.305.998-2.95 1.596-4.722 1.596-.31 0-.613-.019-.91-.058 1.68 1.08 3.74 1.713 5.92 1.713 7.114 0 10.932-5.944 10.932-12.586 0-.192-.005-.384-.015-.573 1.001-.724 1.863-1.605 2.457-2.624-.92.41-1.917.672-2.97.672Z"/>
          </svg>
        </button>
        
        <button 
          onClick={() => shareToPlatform('comments')} 
          className="p-2 rounded-full bg-[#8676B6] text-white hover:bg-[#8676B6]/90 transition-colors duration-300 flex items-center justify-center"
          aria-label="Share to Comments"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* 评论分享模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-9999">
          <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-[#F5F5F7]">Share to Comments</h3>
            
            {/* 可滚动内容区域 */}
            <div className="overflow-y-auto flex-1 pr-2">
              {/* 预览图片 */}
              <div className="border border-[#8676B6]/30 rounded-lg overflow-hidden mb-4">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover" 
                />
              </div>
              
              {/* 用户名输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">Username</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  className="w-full bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg px-4 py-2 text-[#F5F5F7] focus:outline-none focus:border-[#8676B6] focus:shadow-lg transition-all duration-300"
                  placeholder="Enter your username..."
                />
              </div>
              
              {/* 评论内容输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">Your Comment</label>
                <textarea 
                  value={userComment} 
                  onChange={(e) => setUserComment(e.target.value)} 
                  className="w-full bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg px-4 py-2 text-[#F5F5F7] focus:outline-none focus:border-[#8676B6] focus:shadow-lg transition-all duration-300"
                  placeholder="Share your thoughts..."
                  rows={4}
                ></textarea>
              </div>
              
              {/* 头像选择 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#F5F5F7]/80 mb-3">Choose Avatar</label>
                
                {/* 当前头像预览 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#8676B6]/30">
                    <img 
                      src={userAvatar} 
                      alt="Current Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* 本地文件上传 */}
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                      className="hidden" 
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload"
                      className="px-3 py-1 bg-[#8676B6]/20 border border-[#8676B6]/30 rounded-lg text-sm text-[#F5F5F7]/80 hover:bg-[#8676B6]/30 transition-colors duration-300 cursor-pointer"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>
                
                {/* 预设像素头像选择 - 增加列数减少垂直空间 */}
                <div className="grid grid-cols-8 gap-2">
                  {pixelAvatars.map((avatar, index) => (
                    <button 
                      key={index} 
                      onClick={() => setUserAvatar(avatar)} 
                      className={`rounded-full overflow-hidden border-2 transition-all duration-300 ${userAvatar === avatar ? 'border-[#8676B6] shadow-lg' : 'border-[#8676B6]/30 hover:border-[#8676B6]'}`}
                    >
                      <img 
                        src={avatar} 
                        alt={`Avatar ${index + 1}`} 
                        className="w-8 h-8 object-cover" 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 操作按钮 - 固定在底部 */}
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-lg py-2 text-[#F5F5F7]/80 hover:bg-[#1D1D1F]/70 transition-colors duration-300"
              >
                Cancel
              </button>
              <button 
                onClick={saveComment} 
                className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white rounded-lg py-2 transition-colors duration-300"
              >
                Share Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;