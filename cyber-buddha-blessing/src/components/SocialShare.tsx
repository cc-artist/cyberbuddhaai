'use client';

import React from 'react';

interface SocialShareProps {
  imageUrl: string;
  title: string;
  description: string;
  pageUrl: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ imageUrl, title, description, pageUrl }) => {
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
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };
  
  return (
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
    </div>
  );
};

export default SocialShare;