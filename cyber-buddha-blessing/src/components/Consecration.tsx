'use client';

import React, { useState, useRef } from 'react';
import NextImage from 'next/image';
import SocialShare from './SocialShare';


const Consecration: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  // 下载选项状态
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
  const [downloadQuality, setDownloadQuality] = useState<number>(0.9);
  const [downloadResolution, setDownloadResolution] = useState<'normal' | 'high' | 'ultra'>('high');
  // 下载状态
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  // 添香油支付状态
  const [isOfferingOil, setIsOfferingOil] = useState(false);
  const [offeringStatus, setOfferingStatus] = useState<string | null>(null);



  // 下载结果功能
  const handleDownload = async () => {
    if (!resultUrl) return;

    try {
      setIsDownloading(true);
      setDownloadStatus('正在准备下载...');

      // 根据分辨率设置基础尺寸
      const resolutionConfig = {
        normal: { baseWidth: 800, scale: 1 },
        high: { baseWidth: 1200, scale: 1.5 },
        ultra: { baseWidth: 1600, scale: 2 }
      };

      const { baseWidth, scale } = resolutionConfig[downloadResolution];

      // 创建canvas元素用于合成图像
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建Canvas上下文');
      }

      // 创建图像对象
      const bgImage = new Image();
      const itemImage = new Image();

      // 设置图像加载完成后的处理
      const loadImage = (image: HTMLImageElement, src: string, isBackground: boolean = false): Promise<void> => {
        return new Promise((resolve, reject) => {
          image.crossOrigin = 'anonymous';
          image.onload = () => {
            console.log(`成功加载图像: ${src}`);
            resolve();
          };
          image.onerror = () => {
            console.error(`无法加载图像: ${src}`);
            if (isBackground) {
              // 背景图加载失败，使用默认背景
              console.log('使用默认背景');
              resolve(); // 继续执行，后面会处理默认背景
            } else {
              reject(new Error(`无法加载物品图像: ${src}`));
            }
          };
          image.src = src;
        });
      };

      // 加载图像
      setDownloadStatus('正在加载图像...');
      
      // 先加载背景图以确定画布尺寸
      await loadImage(bgImage, '/temple-images/赛博佛祖背景图.png', true);
      
      // 设置画布尺寸以匹配背景图的原始宽高比
      let width, height;
      if (bgImage.complete && bgImage.naturalHeight > 0) {
        // 使用背景图的宽高比
        const aspectRatio = bgImage.naturalWidth / bgImage.naturalHeight;
        width = baseWidth;
        height = width / aspectRatio;
      } else {
        // 如果背景图加载失败，使用默认4:3比例
        width = baseWidth;
        height = width * 3/4;
      }
      
      // 设置canvas实际尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 然后加载物品图
      await loadImage(itemImage, resultUrl);

      // 绘制合成图
      setDownloadStatus('正在生成合成图...');
      
      // 1. 先填充画布背景色，确保整体视觉完整
      ctx.fillStyle = '#1D1D1F';
      ctx.fillRect(0, 0, width, height);
      
      // 2. 绘制背景图，确保完整显示（现在画布已匹配背景图比例）
      if (bgImage.complete && bgImage.naturalHeight > 0) {
        // 背景图加载成功，画布尺寸已匹配，直接绘制完整背景
        const scaleFactor = width / bgImage.naturalWidth;
        
        // 计算绘制尺寸，确保完整显示
        const drawWidth = bgImage.naturalWidth * scaleFactor;
        const drawHeight = bgImage.naturalHeight * scaleFactor;
        
        // 绘制背景图，确保完整显示，无剪切
        ctx.drawImage(bgImage, 0, 0, drawWidth, drawHeight);
      } else {
        // 背景图加载失败，使用默认背景效果
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, 'rgba(134, 118, 182, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(134, 118, 182, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      
      // 2. 绘制佛光效果 - 外层光晕
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 外层光晕 - 与页面效果一致
      const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200 * scale);
      outerGradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
      outerGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.2)');
      outerGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200 * scale, 0, Math.PI * 2);
      ctx.fill();
      
      // 3. 物品容器 - 包含物品和佛光效果
      
      // 物品浮动动画位置
      const itemContainerX = centerX;
      const itemContainerY = centerY;
      
      // 4. 物品佛光 - 内层光晕
      const innerHaloSize = 150 * scale;
      const innerGradient1 = ctx.createRadialGradient(itemContainerX, itemContainerY, 0, itemContainerX, itemContainerY, innerHaloSize);
      innerGradient1.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
      innerGradient1.addColorStop(0.7, 'rgba(255, 215, 0, 0.1)');
      innerGradient1.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = innerGradient1;
      ctx.beginPath();
      ctx.arc(itemContainerX, itemContainerY, innerHaloSize, 0, Math.PI * 2);
      ctx.fill();
      
      // 5. 旋转佛光效果
      const rotateGradientSize = 120 * scale;
      ctx.save();
      ctx.translate(itemContainerX, itemContainerY);
      ctx.rotate(45 * Math.PI / 180);
      
      const rotateGradient = ctx.createLinearGradient(-rotateGradientSize, 0, rotateGradientSize, 0);
      rotateGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
      rotateGradient.addColorStop(0.5, 'rgba(134, 118, 182, 0.3)');
      rotateGradient.addColorStop(1, 'rgba(255, 215, 0, 0.3)');
      
      ctx.fillStyle = rotateGradient;
      ctx.beginPath();
      ctx.arc(0, 0, rotateGradientSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // 6. 绘制物品图
      const maxItemSize = 200 * scale;
      
      // 保持物品图的原始宽高比
      const itemAspectRatio = itemImage.naturalWidth / itemImage.naturalHeight;
      let itemWidth, itemHeight;
      
      if (itemAspectRatio > 1) {
        // 物品图更宽，按宽度缩放
        itemWidth = maxItemSize;
        itemHeight = maxItemSize / itemAspectRatio;
      } else {
        // 物品图更高，按高度缩放
        itemHeight = maxItemSize;
        itemWidth = maxItemSize * itemAspectRatio;
      }
      
      // 计算绘制位置，居中显示
      const itemX = itemContainerX - itemWidth / 2;
      const itemY = itemContainerY - itemHeight / 2;
      
      // 绘制物品图，保持宽高比，居中显示
      ctx.drawImage(itemImage, itemX, itemY, itemWidth, itemHeight);
      
      // 7. 绘制顶部光线效果
      const rayCount = 3;
      const rayColors = ['rgba(255, 215, 0, 0.8)', 'rgba(134, 118, 182, 0.8)', 'rgba(255, 215, 0, 0.8)'];
      
      for (let i = 0; i < rayCount; i++) {
        const rayX = itemContainerX + (i - 1) * 50 * scale;
        const rayHeight = 100 * scale;
        
        // 使用物品的实际高度来计算光线位置
        const rayGradient = ctx.createLinearGradient(rayX, itemContainerY - itemHeight / 2 - rayHeight, rayX, itemContainerY - itemHeight / 2);
        rayGradient.addColorStop(0, 'transparent');
        rayGradient.addColorStop(1, rayColors[i]);
        
        ctx.fillStyle = rayGradient;
        ctx.fillRect(rayX - 2 * scale, itemContainerY - itemHeight / 2 - rayHeight, 4 * scale, rayHeight);
      }
      
      // 8. 生成下载链接
      setDownloadStatus('Generating download link...');
      const mimeType = downloadFormat === 'png' ? 'image/png' : 'image/jpeg';
      
      // 生成Data URL
      const dataUrl = canvas.toDataURL(mimeType, downloadQuality);
      console.log('Successfully generated consecration synthesis image Data URL');
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `cyber-buddha-blessing-${downloadResolution}.${downloadFormat}`;
      document.body.appendChild(link);
      
      // 触发下载
      setDownloadStatus('Downloading...');
      
      // 添加点击延迟确保浏览器有足够时间处理
      setTimeout(() => {
        try {
          link.click();
          console.log('Download link clicked successfully');
          setDownloadStatus('Download completed!');
          
          // 重置状态
          setTimeout(() => {
            setDownloadStatus(null);
          }, 2000);
        } catch (clickError) {
          console.error('Failed to click download link:', clickError);
          // 显示手动保存提示
          setDownloadStatus('Please right-click the image and select "Save Image"');
          
          // 重置状态
          setTimeout(() => {
            setDownloadStatus(null);
          }, 5000);
        } finally {
          document.body.removeChild(link);
        }
      }, 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // 重置状态
      setTimeout(() => {
        setDownloadStatus(null);
      }, 3000);
      
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    // 模拟开光处理过程
    setTimeout(() => {
      // 这里应该调用实际的开光API
      // 我们将在UI层面实现合成效果，所以只需要设置resultUrl为previewUrl即可
      setResultUrl(previewUrl);
      setIsProcessing(false);
    }, 2000);
  };

  // 添香油功能
  const handleOfferOil = async () => {
    setIsOfferingOil(true);
    setOfferingStatus('正在处理添香油支付...');

    try {
      const response = await fetch('http://localhost:3001/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '功德主',
          phone: '13800138000',
          templeId: 1,
          amount: 100, // 1美金
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setOfferingStatus('添香油成功！感谢您的功德！');
        // 3秒后清除状态
        setTimeout(() => {
          setOfferingStatus(null);
        }, 3000);
      } else {
        setOfferingStatus(`添香油失败：${result.message}`);
        // 3秒后清除状态
        setTimeout(() => {
          setOfferingStatus(null);
        }, 3000);
      }
    } catch (error) {
      setOfferingStatus(`添香油失败：${error instanceof Error ? error.message : '网络错误'}`);
      // 3秒后清除状态
      setTimeout(() => {
        setOfferingStatus(null);
      }, 3000);
    } finally {
      setIsOfferingOil(false);
    }
  };



  return (
    <div className="bg-[#1D1D1F] border border-[#8676B6]/30 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#F5F5F7]">Cyber Buddha Consecration</h2>
      
      <div className="space-y-6">
        {/* Upload Area */}
        <div className="border border-[#8676B6]/30 rounded-xl p-8 text-center bg-[#1D1D1F]/50 backdrop-blur-sm">
          <svg className="w-16 h-16 text-[#8676B6] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className="text-lg font-medium mb-2 text-[#F5F5F7]">Upload Item Photo</h3>
          <p className="text-sm text-[#F5F5F7]/70 mb-4">Select a photo of the item you want to consecrate. Cyber Buddha will infuse it with digital spirituality.</p>
          
          <div className="flex flex-col items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="inline-block bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Choose Image
              </span>
            </label>
            <p className="text-xs text-[#F5F5F7]/50">Supports JPG, PNG, WEBP formats | Max 10MB</p>
            <p className="text-xs text-[#FFD700]/70">Please upload images with transparent backgrounds for best results</p>
          </div>
        </div>

        {/* Preview and Processing Area */}
        {previewUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                  <h3 className="text-lg font-medium mb-3 text-[#F5F5F7]">Upload Preview</h3>
                  <div className="border border-[#8676B6]/30 rounded-xl overflow-hidden">
                    <NextImage
                      src={previewUrl}
                      alt="Upload Preview"
                      width={500}
                      height={500}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-[#F5F5F7]">Consecration Result</h3>
              {isProcessing ? (
                <div className="border border-[#8676B6]/30 rounded-xl p-8 text-center bg-[#1D1D1F]/50 backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-[#8676B6]/30 border-t-[#8676B6] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[#F5F5F7]/90">Cyber Buddha is consecrating your item...</p>
                  <p className="text-sm text-[#F5F5F7]/70 mt-2">Infusing digital spirituality, giving new energy to the item</p>
                </div>
              ) : resultUrl ? (
                <div className="space-y-4">
                  <div className="overflow-hidden bg-transparent">
                    {/* 合成结果容器 */}
                    <div className="relative w-full h-96 overflow-hidden">
                      {/* Cyber Buddha Background */}
                      <NextImage
                        src="/temple-images/赛博佛祖背景图.png"
                        alt="Cyber Buddha Background"
                        fill
                        className="object-cover opacity-70"
                      />
                       
                      {/* 佛光效果 - 外层光晕 */}
                      <div className="absolute inset-0 bg-gradient-to-center from-transparent via-[#FFD700]/10 to-transparent animate-pulse"></div>
                       
                      {/* 物品容器 - 包含物品和佛光效果 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* 物品浮动动画 */}
                        <div className="relative animate-float">
                          {/* 物品佛光 - 内层光晕 */}
                          <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/30 to-[#8676B6]/30 rounded-full blur-md animate-spin-slow"></div>
                          
                          {/* 物品图像 */}
                          <NextImage
                            src={resultUrl}
                            alt="开光物品"
                            width={200}
                            height={200}
                            className="relative z-10 object-contain shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                          />
                          
                          
                          
                          {/* 顶部光线效果 */}
                          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-[#FFD700] to-transparent animate-pulse"></div>
                          <div className="absolute -top-20 left-1/3 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-[#8676B6] to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute -top-20 left-2/3 transform -translate-x-1/2 w-1 h-18 bg-gradient-to-b from-[#FFD700] to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Options */}
                  <div className="border border-[#8676B6]/30 rounded-xl p-4 bg-[#1D1D1F]/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium mb-3 text-[#F5F5F7]">Download Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Format Selection */}
                      <div>
                        <label className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">Image Format</label>
                        <select
                          className="w-full bg-[#1D1D1F] border border-[#8676B6]/30 rounded-lg px-3 py-2 text-[#F5F5F7] focus:outline-none focus:border-[#8676B6] focus:shadow-lg transition-all duration-300"
                          value={downloadFormat}
                          onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'jpg')}
                          disabled={isDownloading}
                        >
                          <option value="png">PNG (Lossless)</option>
                          <option value="jpg">JPG (Compressed)</option>
                        </select>
                      </div>
                      
                      {/* Quality Selection */}
                      <div>
                        <label className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">Image Quality ({Math.round(downloadQuality * 100)}%)</label>
                        <input
                          type="range"
                          className="w-full h-2 bg-[#8676B6]/30 rounded-lg appearance-none cursor-pointer"
                          min="0.5"
                          max="1"
                          step="0.05"
                          value={downloadQuality}
                          onChange={(e) => setDownloadQuality(parseFloat(e.target.value))}
                          disabled={isDownloading || downloadFormat === 'png'}
                        />
                      </div>
                      
                      {/* Resolution Selection */}
                      <div>
                        <label className="block text-sm font-medium text-[#F5F5F7]/80 mb-2">Resolution</label>
                        <select
                          className="w-full bg-[#1D1D1F] border border-[#8676B6]/30 rounded-lg px-3 py-2 text-[#F5F5F7] focus:outline-none focus:border-[#8676B6] focus:shadow-lg transition-all duration-300"
                          value={downloadResolution}
                          onChange={(e) => setDownloadResolution(e.target.value as 'normal' | 'high' | 'ultra')}
                          disabled={isDownloading}
                        >
                          <option value="normal">Normal (800×600)</option>
                          <option value="high">High (1200×900)</option>
                          <option value="ultra">Ultra (1600×1200)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Status */}
                  {downloadStatus && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${downloadStatus.includes('失败') ? 'bg-red-500/20 text-red-300' : 'bg-[#8676B6]/20 text-[#8676B6]'} animate-pulse`}>
                      {downloadStatus}
                    </div>
                  )}
                  
                  {/* Offering Oil Status */}
                  {offeringStatus && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${offeringStatus.includes('成功') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} animate-pulse`}>
                      {offeringStatus}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button 
                      className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Downloading...
                        </div>
                      ) : (
                        'Download Result'
                      )}
                    </button>
                  </div>
                  
                  {/* Social Share Section */}
                  <div className="border border-[#8676B6]/30 rounded-xl p-4 bg-[#1D1D1F]/50 backdrop-blur-sm">
                    <h3 className="text-lg font-medium mb-3 text-[#F5F5F7]">Share to Social Media</h3>
                    {resultUrl && (
                      <SocialShare 
                        imageUrl={resultUrl} 
                        title="Cyber Buddha Consecration Result" 
                        description="Check out my Cyber Buddha Consecration result!" 
                        pageUrl="https://your-vercel-domain" 
                      />
                    )}
                  </div>
                  
                  {/* Offer Oil Button */}
                  <div className="w-full mt-4">
                    <div className="text-center mb-2">
                      <span className="text-[#F5F5F7]/80 font-medium">Support us with an offering</span>
                    </div>
                    
                    {/* PayPal Button */}
                    <div>
                      <style>{`.pp-KWCN3QN74N4X4{text-align:center;border:none;border-radius:0.25rem;min-width:11.625rem;padding:0 2rem;height:2.625rem;font-weight:bold;background-color:#FFD140;color:#000000;font-family:Helvetica Neue,Arial,sans-serif;font-size:1rem;line-height:1.25rem;cursor:pointer;}`}</style>
                      <form action="https://www.paypal.com/ncp/payment/KWCN3QN74N4X4" method="post" target="_blank" style={{display:'inline-grid',justifyItems:'center',alignContent:'start',gap:'0.5rem'}}>
                        <input className="pp-KWCN3QN74N4X4" type="submit" value="Click to Pay" />
                        <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" />
                        <section style={{fontSize: '0.75rem', color: '#1a56db', fontWeight: 'bold'}}>PayPal</section>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-[#8676B6]/30 rounded-xl p-8 text-center bg-[#1D1D1F]/50 backdrop-blur-sm">
                  <svg className="w-16 h-16 text-[#8676B6]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#F5F5F7]/70">Click the button below to start consecration</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {previewUrl && !isProcessing && !resultUrl && (
          <div className="flex justify-center">
            <button
              className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={handleUpload}
            >
              Start Consecration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consecration;
