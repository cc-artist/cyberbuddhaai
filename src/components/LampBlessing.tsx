'use client';

import React, { useState, useRef, useEffect } from 'react';
import SocialShare from './SocialShare';

const LampBlessing: React.FC = () => {
  const [isLit, setIsLit] = useState(false);
  const [wish, setWish] = useState('');
  const [isWishing, setIsWishing] = useState(false);
  const [wishResult, setWishResult] = useState<string | null>(null);
  // 添香油支付状态
  const [isOfferingOil, setIsOfferingOil] = useState(false);
  const [offeringStatus, setOfferingStatus] = useState<string | null>(null);
  // 图片生成相关
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const lampRef = useRef<HTMLDivElement>(null);
  const wishResultRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const handleLightLamp = () => {
    setIsLit(true);
  };

  const handleMakeWish = () => {
    if (!wish.trim()) return;
    setIsWishing(true);
    // 模拟祈福过程
    setTimeout(() => {
      setWishResult(wish);
      setIsWishing(false);
      // 直接生成祝福图片，传递当前wish值，确保只需要点击一次按钮
      generateImage(wish);
    }, 2000);
  };

  const resetLamp = () => {
    setIsLit(false);
    setWish('');
    setWishResult(null);
  };

  // 添香油功能
  // 设置当前日期
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(formattedDate);
  }, []);

  // 生成合成图片
  const generateImage = (wishText?: string) => {
    // 使用传入的wishText或当前的wishResult，如果都没有则返回
    const textToUse = wishText || wishResult;
    if (!textToUse || !isLit) return;

    // 创建9:16比例的canvas，使用高清尺寸
    const canvas = document.createElement('canvas');
    // 使用原始尺寸以获得高清效果
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置背景
    ctx.fillStyle = '#1D1D1F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 使用缩放变换将整个内容放大1倍，以实现高清效果
    ctx.scale(2, 2);
    
    // 绘制Cyber Buddha Logo
    ctx.fillStyle = '#8676B6';
    ctx.font = 'bold 36px SF Pro Display';
    ctx.textAlign = 'center';
    ctx.fillText('Cyber Buddha', canvas.width / 4, 40);

    // 绘制当前日期
    ctx.fillStyle = '#F5F5F7';
    ctx.font = '16px SF Pro Text';
    ctx.fillText(currentDate, canvas.width / 4, 60);

    // 重新绘制长明灯，与参考图片样式一致 - 简约风格
    const lampX = canvas.width / 4;
    const lampY = 300; // 长明灯容器底部位置，下移二分之一高度
    
    // 长明灯各个部分的正确定位关系（从下到上）
    // 1. 灯座 (底部)
    // 2. 灯柱 (中间)
    // 3. 灯罩 (顶部，黄色边框矩形)
    // 4. 火焰 (在灯罩内部，简单的黄色和橙色)

    // 灯座 - 最底部，灰色矩形
    ctx.fillStyle = '#666';
    ctx.fillRect(lampX - 32, lampY, 64, 16);

    // 灯柱 - 连接灯座和灯罩，灰色细杆
    ctx.fillStyle = '#555';
    ctx.fillRect(lampX - 4, lampY - 100, 8, 100);

    // 灯罩 - 黄色边框矩形，顶端两个角为圆角，参考图片样式
    const shadeWidth = 96; // 宽度
    const shadeHeight = 128; // 高度
    const shadeX = lampX - shadeWidth / 2;
    const shadeY = lampY - 100 - shadeHeight;
    const cornerRadius = 16; // 顶端圆角半径
    
    // 绘制灯罩边框 - 带圆角的矩形
    ctx.strokeStyle = '#FFD700'; // 黄色边框
    ctx.lineWidth = 4; // 边框宽度
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)'; // 黄色半透明填充
    
    // 绘制带圆角的矩形路径（仅顶端两个角为圆角）
    ctx.beginPath();
    // 左下角
    ctx.moveTo(shadeX, shadeY + shadeHeight);
    // 右下角
    ctx.lineTo(shadeX + shadeWidth, shadeY + shadeHeight);
    // 右侧边
    ctx.lineTo(shadeX + shadeWidth, shadeY + cornerRadius);
    // 右上角圆角
    ctx.quadraticCurveTo(shadeX + shadeWidth, shadeY, shadeX + shadeWidth - cornerRadius, shadeY);
    // 上边
    ctx.lineTo(shadeX + cornerRadius, shadeY);
    // 左上角圆角
    ctx.quadraticCurveTo(shadeX, shadeY, shadeX, shadeY + cornerRadius);
    // 左侧边
    ctx.lineTo(shadeX, shadeY + shadeHeight);
    ctx.closePath();
    
    // 填充内部
    ctx.fill();
    // 绘制边框
    ctx.stroke();

    // 火焰 - 简单的黄色和橙色火焰，在灯罩内部
    const flameX = lampX;
    const flameBottomY = lampY - 100; // 火焰底部与灯罩底部对齐
    const flameHeight = shadeHeight * 0.7; // 火焰高度为灯罩高度的70%
    
    // 火焰容器 - 橙色矩形
    ctx.fillStyle = '#FF8C00';
    ctx.fillRect(flameX - 12, flameBottomY - flameHeight, 24, flameHeight);
    
    // 火焰顶部 - 黄色矩形
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(flameX - 8, flameBottomY - flameHeight, 16, flameHeight * 0.6);
    
    // 火焰尖端 - 更小的黄色矩形
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(flameX - 4, flameBottomY - flameHeight, 8, flameHeight * 0.3);
    
    // 灯油盘 - 在火焰中间，半透明效果，横向长度增加为目前的2倍，底部两个角为圆角
    const oilPanX = lampX;
    // 灯油盘位置调整到火焰的中线高度
    const oilPanY = flameBottomY - flameHeight * 0.5;
    const oilPanWidth = 72; // 灯油盘宽度，增加为当前的2倍（36px * 2）
    const oilPanHeight = 12; // 灯油盘高度
    const oilPanRadius = 6; // 底部圆角半径
    
    // 计算灯油盘位置坐标
    const oilPanLeft = oilPanX - oilPanWidth / 2;
    const oilPanTop = oilPanY - oilPanHeight / 2;
    const oilPanRight = oilPanX + oilPanWidth / 2;
    const oilPanBottom = oilPanY + oilPanHeight / 2;
    
    // 绘制半透明灯油盘底座 - 底部两个角为圆角
    ctx.fillStyle = 'rgba(102, 102, 102, 0.6)'; // 半透明灰色
    ctx.beginPath();
    // 左上角
    ctx.moveTo(oilPanLeft, oilPanTop);
    // 右上角
    ctx.lineTo(oilPanRight, oilPanTop);
    // 右侧边
    ctx.lineTo(oilPanRight, oilPanBottom - oilPanRadius);
    // 右下角圆角
    ctx.quadraticCurveTo(oilPanRight, oilPanBottom, oilPanRight - oilPanRadius, oilPanBottom);
    // 底部边
    ctx.lineTo(oilPanLeft + oilPanRadius, oilPanBottom);
    // 左下角圆角
    ctx.quadraticCurveTo(oilPanLeft, oilPanBottom, oilPanLeft, oilPanBottom - oilPanRadius);
    // 回到左上角
    ctx.closePath();
    ctx.fill();
    
    // 绘制半透明灯油 - 底部两个角为圆角
    const oilInset = 2; // 灯油内边距
    const oilLeft = oilPanLeft + oilInset;
    const oilTop = oilPanTop + oilInset;
    const oilRight = oilPanRight - oilInset;
    const oilBottom = oilPanBottom - oilInset;
    const oilRadius = oilPanRadius - oilInset;
    
    ctx.fillStyle = 'rgba(255, 140, 0, 0.4)'; // 半透明橙色
    ctx.beginPath();
    // 左上角
    ctx.moveTo(oilLeft, oilTop);
    // 右上角
    ctx.lineTo(oilRight, oilTop);
    // 右侧边
    ctx.lineTo(oilRight, oilBottom - oilRadius);
    // 右下角圆角
    ctx.quadraticCurveTo(oilRight, oilBottom, oilRight - oilRadius, oilBottom);
    // 底部边
    ctx.lineTo(oilLeft + oilRadius, oilBottom);
    // 左下角圆角
    ctx.quadraticCurveTo(oilLeft, oilBottom, oilLeft, oilBottom - oilRadius);
    // 回到左上角
    ctx.closePath();
    ctx.fill();

    // 绘制灯点亮文字
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px SF Pro Display';
    ctx.fillText('Eternal Lamp is Lit', canvas.width / 4, lampY + 70);
    
    ctx.fillStyle = '#F5F5F7';
    ctx.font = '18px SF Pro Text';
    ctx.fillText('May the light illuminate your future', canvas.width / 4, lampY + 85);

    // 绘制用户愿望 - 去掉紫色方框，优化文字显示以支持200字
    ctx.fillStyle = '#F5F5F7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const wishX = canvas.width / 4;
    const wishY = 400; // 位置调整，下移二分之一高度
    const maxWidth = 320; // 增加文本换行宽度，支持更多文字
    const lineHeight = 40; // 减小行高，支持更多行
    
    // 文本换行
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      // 处理中文和英文混合文本的换行
      let currentLine = '';
      let currentY = y;
      
      // 将文本按字符分割，支持中文换行
      const characters = text.split('');
      
      for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        // 如果当前行加上下一个字符超过最大宽度，或者遇到换行符，就换行
        if (testWidth > maxWidth || char === '\n') {
          ctx.fillText(currentLine, x, currentY);
          currentLine = char === '\n' ? '' : char;
          currentY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      
      // 绘制最后一行
      if (currentLine) {
        ctx.fillText(currentLine, x, currentY);
      }
    };
    
    // 绘制"Your Wish"标题
    ctx.fillStyle = '#F5F5F7'; // 乳白色标题
    ctx.font = 'bold 28px SF Pro Display';
    ctx.fillText('Your Wish', canvas.width / 4, wishY - 60);
    
    // 去掉紫色方框，直接绘制文字
    ctx.fillStyle = '#FFD700'; // 金黄色愿望内容
    ctx.font = '28px SF Pro Text'; // 减小字体大小，支持更多文字
    wrapText(textToUse, wishX, wishY, maxWidth, lineHeight);

    // 转换为图片URL
    const dataURL = canvas.toDataURL('image/png');
    setGeneratedImage(dataURL);
  };

  // 下载图片
  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `cyber-buddha-lamp-blessing-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 添香油功能
  const handleOfferOil = async () => {
    setIsOfferingOil(true);
    setOfferingStatus('正在处理添香油支付...');

    try {
      const response = await fetch('/api/v1/payments', {
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
      <h2 className="text-2xl font-bold mb-6 text-[#F5F5F7]">Lamp Blessing</h2>
      
      <div className="space-y-6">
        {/* Eternal Lamp Display */}
        <div className="border border-[#8676B6]/30 rounded-xl p-8 text-center bg-[#1D1D1F]/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-auto" style={{ height: '200px' }}>
            {/* Lamp Base */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gradient-to-r from-[#666] to-[#333] rounded-t-lg"></div>
            
            {/* Lamp Post */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-gradient-to-t from-[#666] to-[#333]"></div>
            
            {/* Lamp Shade */}
            <div className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-[#8676B6]/30 rounded-t-2xl transition-all duration-500 ${isLit ? 'bg-[#FFD700]/20 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'bg-[#1D1D1F]/50'}`}>
              {/* Flame */}
              {isLit && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-16">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-gradient-to-t from-[#FF6B00] via-[#FFD700] to-transparent rounded-t-full animate-pulse"></div>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-10 bg-gradient-to-t from-[#FFD700] to-transparent rounded-t-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
            
            {/* Lamp Top */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-[#8676B6]/30 rounded-b-lg"></div>
          </div>
          
          <div className="mt-4">
            {!isLit ? (
              <button
                className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                onClick={handleLightLamp}
              >
                Light the Eternal Lamp
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-[#FFD700] font-medium">Eternal Lamp is Lit</p>
                <p className="text-sm text-[#F5F5F7]/70">May the light illuminate your future</p>
              </div>
            )}
          </div>
        </div>

        {/* Blessing Area */}
        {isLit && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-[#F5F5F7]">Make Your Wish</h3>
            <div className="space-y-4">
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Please enter your wish..."
                className="w-full h-32 bg-[#1D1D1F]/50 border border-[#8676B6]/30 rounded-xl p-4 text-[#F5F5F7] resize-none focus:outline-none focus:border-[#8676B6] focus:shadow-lg transition-all duration-300"
                maxLength={200}
              ></textarea>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#F5F5F7]/50">{wish.length}/200</span>
                <div className="flex gap-3">
                  <button
                    className="bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] text-[#8676B6] px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={resetLamp}
                  >
                    Reset
                  </button>
                  <button
                    className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleMakeWish}
                    disabled={!wish.trim() || isWishing}
                  >
                    {isWishing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Making Wish...
                      </div>
                    ) : (
                      'Make Wish'
                    )}
                  </button>
                </div>
              </div>
              
              {/* Offering Oil Status */}
              {offeringStatus && (
                <div className={`p-3 rounded-lg text-sm font-medium ${offeringStatus.includes('成功') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} animate-pulse`}>
                  {offeringStatus}
                </div>
              )}
              

            </div>
          </div>
        )}

        {/* Blessing Result */}
        {isWishing ? (
          <div className="border border-[#8676B6]/30 rounded-xl p-8 text-center bg-[#1D1D1F]/50 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-[#8676B6]/30 border-t-[#8676B6] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#F5F5F7]/90">Cyber Buddha is listening to your wish...</p>
            <p className="text-sm text-[#F5F5F7]/70 mt-2">May your wish come true soon</p>
          </div>
        ) : wishResult ? (
          <div className="border border-[#8676B6]/30 rounded-xl p-8 bg-[#1D1D1F]/50 backdrop-blur-sm">
            {/* Generated Image Preview */}
            {generatedImage && (
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-medium text-[#F5F5F7]">Blessing Image (9:16)</h4>
                <div className="border border-[#8676B6]/30 rounded-xl overflow-hidden flex justify-center items-center">
                  <img 
                    src={generatedImage || ''} 
                    alt="Blessing Image" 
                    width={800} 
                    height={1422} 
                    className="w-full max-w-md mx-auto rounded-xl" 
                    style={{ maxHeight: '400px' }} // 限制图片高度，防止遮挡评论区
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1D1D1F] px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={downloadImage}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </button>
                </div>
                
                {/* Social Share Buttons */}
                <div id="unique-share-section" className="w-full mt-6">
                  <h3 className="text-md font-medium mb-4 text-[#F5F5F7]">Share Your Blessing Experience</h3>
                  <SocialShare
                    imageUrl={generatedImage || ''}
                    title="My Cyber Buddha Lamp Blessing"
                    description={wishResult || ''}
                    pageUrl="https://cyber-buddha.blessing"
                  />
                </div>
                
                {/* Offer Oil Button - Moved below Download Image */}
                <div className="w-full mt-6">
                  <div className="text-center mb-2">
                    <span className="text-[#F5F5F7]/80 font-medium">Support us with an offering</span>
                  </div>
                  
                  {/* PayPal Button */}
                  <div>
                    <style>{`.pp-KWCN3QN74N4X4{text-align:center;border:none;border-radius:0.25rem;min-width:11.625rem;padding:0 2rem;height:2.625rem;font-weight:bold;background-color:#FFD140;color:#000000;font-family:Helvetica Neue,Arial,sans-serif;font-size:1rem;line-height:1.25rem;cursor:pointer;}`}</style>
                    <form action="https://www.paypal.com/ncp/payment/KWCN3QN74N4X4" method="post" target="_blank" style={{display:'inline-grid',justifyItems:'center',alignContent:'start',gap:'0.5rem'}}>
                      <input className="pp-KWCN3QN74N4X4" type="submit" value="Click to Pay" />
                      <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" width={200} height={25} />
                      <section style={{fontSize: '0.75rem', color: '#1a56db', fontWeight: 'bold'}}>PayPal</section>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}


      </div>
    </div>
  );
};

export default LampBlessing;
