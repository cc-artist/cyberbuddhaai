'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import SocialShare from './SocialShare';



const DharmaForm: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>('cyber');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultData, setResultData] = useState<{ 
    imageUrl: string; 
    quote: string; 
    date: string 
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 添香油支付状态
  const [isOfferingOil, setIsOfferingOil] = useState(false);
  const [offeringStatus, setOfferingStatus] = useState<string | null>(null);



  // Buddhist quotes
  const buddhistQuotes = [
    "All conditioned things are impermanent, all phenomena lack self, nirvana is tranquil",
    "All conditioned phenomena are like dreams, illusions, bubbles, shadows, like dew or lightning, you should contemplate them thus",
    "Form is emptiness, emptiness is form",
    "The sea of suffering is boundless, but the shore is at hand when you turn around",
    "One flower is one world, one leaf is one Bodhi",
    "The past mind cannot be obtained, the present mind cannot be obtained, the future mind cannot be obtained",
    "All appearances are illusory. If you see that all appearances are not appearances, you see the Tathagata",
    "Bodhi is not a tree, the bright mirror is not a stand, originally there is nothing, where can dust alight?",
    "Dependent origination is emptiness, emptiness is dependent origination",
    "The mind is like a skilled painter, capable of painting all the world",
    "All sentient beings have the wisdom and virtue of the Tathagata, but they cannot realize it because of delusions and attachments",
    "Abstain from all evil, practice all good, purify your mind, this is the teaching of all Buddhas",
    "Bodhisattvas fear causes, sentient beings fear effects",
    "If a bodhisattva has the idea of self, others, sentient beings, or a lifespan, they are not a bodhisattva",
    "One recitation of the Buddha's name has immeasurable merit; one bow to the Buddha eradicates sins as numerous as river sands"
  ];

  const dharmaStyles = [
    { id: 'cyber', name: 'Cyber Style', description: 'Cyber Buddha Dharma form blending modern technology with traditional Buddhism' },
    { id: 'traditional', name: 'Traditional Style', description: 'Traditional Buddhist style Buddha Dharma form' },
    { id: 'minimalist', name: 'Minimalist Style', description: 'Simplified design of Buddha Dharma form' },
    { id: 'abstract', name: 'Abstract Style', description: 'Abstract artistic expression of Buddha Dharma form' },
  ];

  // Format date
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get random Buddhist quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * buddhistQuotes.length);
    return buddhistQuotes[randomIndex];
  };

  // Text wrapping function
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        ctx.strokeText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    ctx.fillText(line, x, currentY);
    ctx.strokeText(line, x, currentY);
    return currentY;
  };

  // Draw galaxy effect
  const drawGalaxy = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    speed: number
  ) => {
    // Draw multiple galaxy layers
    for (let layer = 0; layer < 3; layer++) {
      const opacity = 0.3 - layer * 0.1;
      const thickness = 2 - layer * 0.5;
      
      for (let i = 0; i < 5; i++) {
        ctx.save();
        
        // Create galaxy path
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * height);
        
        // Generate wavy galaxy
        for (let x = 0; x < width; x += 50) {
          const y = Math.sin(x * 0.01 + layer + speed) * 50 + height / 2 + Math.random() * 100 - 50;
          ctx.lineTo(x, y);
        }
        
        // Create galaxy gradient
        const gradient = ctx.createLinearGradient(0, 0, thickness, 0);
        gradient.addColorStop(0, `rgba(134, 118, 182, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(134, 118, 182, ${opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = thickness;
        ctx.stroke();
        
        ctx.restore();
      }
    }
  };

  // Define types
  interface Point {
    x: number;
    y: number;
  }

  interface ConstellationsMap {
    [key: string]: Point[][];
  }

  // Draw constellation
  const drawConstellation = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    type: string,
    constellations: ConstellationsMap
  ) => {
    const constellationList = constellations[type as keyof ConstellationsMap] || [];
    
    constellationList.forEach((constellation: Point[]) => {
      ctx.save();
      ctx.beginPath();
      
      // Draw constellation lines
      constellation.forEach((point: Point, index: number) => {
        const x = point.x * width;
        const y = point.y * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      // Set constellation line style
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw constellation nodes
      constellation.forEach((point: Point) => {
        const x = point.x * width;
        const y = point.y * height;
        
        // Node glow
        const nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, 5);
        nodeGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        nodeGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.restore();
    });
  };

  // Draw decorations
  const drawDecorations = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    decorations: string[]
  ) => {
    decorations.forEach((decoration) => {
      ctx.save();
      
      switch (decoration) {
        case 'neonGrid':
          // Draw neon grid
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
          ctx.lineWidth = 0.5;
          
          // Vertical lines
          for (let x = 0; x <= width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          
          // Horizontal lines
          for (let y = 0; y <= height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
          break;
          
        case 'lotus':
          // Draw lotus decoration
          const centerX = width * 0.2;
          const centerY = height * 0.3;
          
          // Lotus petals
          for (let i = 0; i < 8; i++) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((Math.PI * 2 / 8) * i);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(20, -30, 40, -40, 0, -50);
            ctx.bezierCurveTo(-40, -40, -20, -30, 0, 0);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            
            ctx.restore();
          }
          break;
          
        case 'simpleShapes':
          // Draw simple geometric shapes
          // Circle
          ctx.beginPath();
          ctx.arc(width * 0.2, height * 0.2, 30, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(134, 118, 182, 0.2)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(134, 118, 182, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Triangle
          ctx.beginPath();
          ctx.moveTo(width * 0.8, height * 0.2);
          ctx.lineTo(width * 0.85, height * 0.3);
          ctx.lineTo(width * 0.75, height * 0.3);
          ctx.closePath();
          ctx.fillStyle = 'rgba(134, 118, 182, 0.2)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(134, 118, 182, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          break;
          
        case 'abstractShapes':
          // Draw abstract shapes
          for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.translate(width * 0.2 + i * 100, height * 0.2);
            ctx.rotate(i * 0.5);
            
            ctx.beginPath();
            ctx.moveTo(0, -30);
            ctx.lineTo(20, 30);
            ctx.lineTo(-20, 30);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(-20, 30, 20, -30);
            gradient.addColorStop(0, 'rgba(255, 107, 107, 0.3)');
            gradient.addColorStop(1, 'rgba(78, 205, 196, 0.3)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.restore();
          }
          break;
      }
      
      ctx.restore();
    });
  };

  // Draw enhanced stars
  const drawEnhancedStars = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    count: number,
    colors: string[],
    twinkle: boolean,
    twinkleSpeed: number
  ) => {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const brightness = twinkle ? (Math.sin(Date.now() * 0.001 + i * twinkleSpeed) * 0.5 + 0.5) : 1;
      
      // 绘制星星光晕
      const starGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      starGradient.addColorStop(0, `${color}${Math.floor(brightness * 255).toString(16).padStart(2, '0')}`);
      starGradient.addColorStop(0.5, `${color}80`);
      starGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = starGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制星星核心
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 生成星空图
  const generateStarrySky = (style: string, quote: string, date: string): string => {
    const canvas = canvasRef.current;
    if (!canvas) {
      // 如果canvas不可用，返回一个默认的黑色背景图片
      const defaultCanvas = document.createElement('canvas');
      defaultCanvas.width = 800;
      defaultCanvas.height = 600;
      const defaultCtx = defaultCanvas.getContext('2d');
      if (defaultCtx) {
        defaultCtx.fillStyle = '#1D1D1F';
        defaultCtx.fillRect(0, 0, 800, 600);
        
        // 在默认画布上绘制文字
        defaultCtx.fillStyle = '#ffffff';
        defaultCtx.strokeStyle = '#8676B6';
        defaultCtx.shadowColor = '#00ffff';
        defaultCtx.shadowBlur = 15;
        defaultCtx.lineWidth = 3;
        defaultCtx.font = 'bold 28px serif';
        defaultCtx.textAlign = 'center';
        defaultCtx.textBaseline = 'middle';
        defaultCtx.fillText(quote, 400, 250);
        defaultCtx.strokeText(quote, 400, 250);
        
        defaultCtx.font = 'italic 20px serif';
        defaultCtx.fillStyle = '#ffffff';
        defaultCtx.strokeStyle = '#8676B6';
        defaultCtx.shadowBlur = 10;
        defaultCtx.fillText(date, 400, 320);
        defaultCtx.strokeText(date, 400, 320);
        
        return defaultCanvas.toDataURL('image/png');
      }
      return '';
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // 如果context不可用，返回一个默认的黑色背景图片
      const defaultCanvas = document.createElement('canvas');
      defaultCanvas.width = 800;
      defaultCanvas.height = 600;
      const defaultCtx = defaultCanvas.getContext('2d');
      if (defaultCtx) {
        defaultCtx.fillStyle = '#1D1D1F';
        defaultCtx.fillRect(0, 0, 800, 600);
        
        // 在默认画布上绘制文字
        defaultCtx.fillStyle = '#ffffff';
        defaultCtx.strokeStyle = '#8676B6';
        defaultCtx.shadowColor = '#00ffff';
        defaultCtx.shadowBlur = 15;
        defaultCtx.lineWidth = 3;
        defaultCtx.font = 'bold 28px serif';
        defaultCtx.textAlign = 'center';
        defaultCtx.textBaseline = 'middle';
        defaultCtx.fillText(quote, 400, 250);
        defaultCtx.strokeText(quote, 400, 250);
        
        defaultCtx.font = 'italic 20px serif';
        defaultCtx.fillStyle = '#ffffff';
        defaultCtx.strokeStyle = '#8676B6';
        defaultCtx.shadowBlur = 10;
        defaultCtx.fillText(date, 400, 320);
        defaultCtx.strokeText(date, 400, 320);
        
        return defaultCanvas.toDataURL('image/png');
      }
      return '';
    }

    // 设置画布尺寸
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 星座数据
    const constellations = {
      traditional: [
        // 北斗七星
        [{x: 0.2, y: 0.3}, {x: 0.25, y: 0.28}, {x: 0.3, y: 0.27}, {x: 0.35, y: 0.28}, {x: 0.38, y: 0.32}, {x: 0.42, y: 0.35}, {x: 0.45, y: 0.38}]
      ],
      modern: [
        // 创意星座 - 心形
        [{x: 0.3, y: 0.4}, {x: 0.35, y: 0.35}, {x: 0.4, y: 0.4}, {x: 0.375, y: 0.45}, {x: 0.325, y: 0.45}]
      ],
      abstract: [
        // 抽象几何图形 - 三角形
        [{x: 0.2, y: 0.2}, {x: 0.3, y: 0.4}, {x: 0.4, y: 0.2}, {x: 0.2, y: 0.2}]
      ]
    };

    // 风格配置
    const styleConfig = {
      cyber: {
        bgGradient: ['#0a0a1a', '#1a1a3a', '#2a1a4a'],
        starColors: ['#ffffff', '#ffd700', '#8676B6', '#00ffff'],
        starCount: 300,
        energyFlow: true,
        hasGalaxy: true,
        galaxySpeed: 0.5,
        constellationType: 'modern',
        decorations: ['neonGrid', 'digitalSymbols', 'cyberStatue'],
        starTwinkle: true,
        twinkleSpeed: 0.5
      },
      traditional: {
        bgGradient: ['#0a0a0a', '#1a1a2a', '#2a2a3a'],
        starColors: ['#ffffff', '#f5f5f5', '#e0e0e0', '#c0c0c0'],
        starCount: 200,
        energyFlow: false,
        hasGalaxy: true,
        galaxySpeed: 0.2,
        constellationType: 'traditional',
        decorations: ['lotus', 'pagoda', 'traditionalPattern'],
        starTwinkle: false,
        twinkleSpeed: 0
      },
      minimalist: {
        bgGradient: ['#1a1a1a', '#2a2a2a', '#3a3a3a'],
        starColors: ['#ffffff', '#f0f0f0'],
        starCount: 100,
        energyFlow: false,
        hasGalaxy: false,
        galaxySpeed: 0,
        constellationType: 'modern',
        decorations: ['simpleShapes', 'subtleLight'],
        starTwinkle: true,
        twinkleSpeed: 0.3
      },
      abstract: {
        bgGradient: ['#1a0a2a', '#2a1a3a', '#3a2a4a'],
        starColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
        starCount: 250,
        energyFlow: true,
        hasGalaxy: true,
        galaxySpeed: 0.8,
        constellationType: 'abstract',
        decorations: ['abstractShapes', 'colorGradient', 'dynamicPattern'],
        starTwinkle: true,
        twinkleSpeed: 0.7
      }
    };

    const config = styleConfig[style as keyof typeof styleConfig] || styleConfig.cyber;

    // 绘制渐变背景
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    config.bgGradient.forEach((color, index) => {
      bgGradient.addColorStop(index / (config.bgGradient.length - 1), color);
    });
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 绘制星河效果
    if (config.hasGalaxy) {
      drawGalaxy(ctx, width, height, config.galaxySpeed);
    }

    // 绘制星座图
    if (config.constellationType) {
      drawConstellation(ctx, width, height, config.constellationType, constellations);
    }

    // 绘制装饰元素
    if (config.decorations) {
      drawDecorations(ctx, width, height, config.decorations); 
    }

    // 绘制增强版星星
    drawEnhancedStars(
      ctx, 
      width, 
      height, 
      config.starCount, 
      config.starColors, 
      config.starTwinkle || false, 
      config.twinkleSpeed || 0.5
    );

    // 添加玄学能量流动效果
    if (config.energyFlow) {
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const length = Math.random() * 20 + 10;
        const angle = Math.random() * Math.PI * 2;
        const opacity = Math.random() * 0.5 + 0.1;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        const energyGradient = ctx.createLinearGradient(0, 0, length, 0);
        energyGradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`);
        energyGradient.addColorStop(1, `rgba(134, 118, 182, ${opacity})`);

        ctx.strokeStyle = energyGradient;
        ctx.lineWidth = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();

        ctx.restore();
      }
    }

    // 根据风格选择文字颜色方案
    const textColorConfig = {
      cyber: {
        fill: '#ffffff',
        glow: '#8676B6',
        stroke: '#00ffff'
      },
      traditional: {
        fill: '#ffd700',
        glow: '#8B4513',
        stroke: '#000000'
      },
      minimalist: {
        fill: '#f5f5f5',
        glow: '#8676B6',
        stroke: '#333333'
      },
      abstract: {
        fill: '#ffffff',
        glow: '#ff6b6b',
        stroke: '#4ecdc4'
      }
    };
    
    const textConfig = textColorConfig[style as keyof typeof textColorConfig] || textColorConfig.cyber;
    
    // 设置文字样式
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // 计算文字位置和换行
    const maxTextWidth = width * 0.8;
    const lineHeight = 45;
    const startY = height / 2 - 80;
    
    // 绘制带有发光效果的文字
    ctx.shadowColor = textConfig.glow;
    ctx.shadowBlur = 15;
    ctx.fillStyle = textConfig.fill;
    ctx.strokeStyle = textConfig.stroke;
    ctx.lineWidth = 3;
    
    const endY = wrapText(ctx, quote, width / 2, startY, maxTextWidth, lineHeight);
    
    // 绘制日期
    ctx.font = 'italic 20px serif';
    ctx.shadowBlur = 10;
    ctx.fillStyle = textConfig.fill;
    ctx.strokeStyle = textConfig.stroke;
    ctx.textAlign = 'center';
    ctx.fillText(date, width / 2, endY + 30);
    ctx.strokeText(date, width / 2, endY + 30);
    
    // 重置阴影效果
    ctx.shadowBlur = 0;

    // 转换为Data URL
    return canvas.toDataURL('image/png');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      const quote = getRandomQuote();
      const date = formatDate();
      const imageUrl = generateStarrySky(selectedStyle, quote, date);
      
      setResultData({ imageUrl, quote, date });
      setIsGenerating(false);
    }, 2000);
  };

  // 下载功能
  const handleDownload = () => {
    if (!resultData?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = resultData.imageUrl;
    link.download = `dharma-form-${selectedStyle}-${formatDate()}.png`;
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
      <h2 className="text-2xl font-bold mb-6 text-[#F5F5F7]">Request Dharma Form</h2>
      
      <div className="space-y-6">
        {/* Hidden Canvas for generating star map */}
        <canvas ref={canvasRef} className="hidden"></canvas>
        
        {/* Style Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-[#F5F5F7]">Choose Dharma Form Style</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dharmaStyles.map((style) => (
              <div
                key={style.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${selectedStyle === style.id ? 'border-[#8676B6] bg-[#8676B6]/10 shadow-lg' : 'border-[#8676B6]/30 bg-[#1D1D1F]/50 hover:border-[#8676B6]/60'}`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedStyle === style.id ? 'bg-[#8676B6] text-white' : 'bg-[#8676B6]/20 text-[#8676B6]'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#F5F5F7]">{style.name}</h4>
                    <p className="text-sm text-[#F5F5F7]/70 mt-1">{style.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : (
              'Generate Dharma Form'
            )}
          </button>
        </div>

        {/* Result Display */}
        {isGenerating ? (
          <div className="border border-[#8676B6]/30 rounded-xl p-8 text-center bg-[#1D1D1F]/50 backdrop-blur-sm animate-pulse">
            <div className="w-16 h-16 border-4 border-[#8676B6]/30 border-t-[#8676B6] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#F5F5F7]/90">Generating your exclusive Dharma form...</p>
            <p className="text-sm text-[#F5F5F7]/70 mt-2">Cyber Buddha is revealing the wisdom Dharma form for you</p>
          </div>
        ) : resultData ? (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-medium text-[#F5F5F7]">Your Exclusive Dharma Form</h3>
            <div className="border border-[#8676B6]/30 rounded-xl overflow-hidden bg-[#1D1D1F]/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500">
              {/* Star Map Display */}
              <div className="relative w-full h-96 overflow-hidden">
                <Image
                  src={resultData.imageUrl}
                  alt="Generated Dharma Form"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Offering Oil Status */}
            {offeringStatus && (
              <div className={`p-3 rounded-lg text-sm font-medium ${offeringStatus.includes('成功') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} animate-pulse`}>
                {offeringStatus}
              </div>
            )}
            
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleDownload}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Dharma Form
              </button>
              <button 
                className="flex-1 bg-[#1D1D1F]/50 backdrop-blur-sm border border-[#8676B6]/30 hover:border-[#8676B6] text-[#8676B6] py-3 rounded-lg font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={handleGenerate}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            </div>
            
            {/* Social Share Section */}
            <div className="border border-[#8676B6]/30 rounded-xl p-4 bg-[#1D1D1F]/50 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-3 text-[#F5F5F7]">Share to Social Media</h3>
              {resultData && (
                <SocialShare 
                  imageUrl={resultData.imageUrl} 
                  title="Cyber Buddha Dharma Form" 
                  description="Check out my exclusive Cyber Buddha Dharma Form!" 
                  pageUrl={window.location.href} 
                />
              )}
            </div>
            
            {/* Offer Oil Button with PayPal */}
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
        ) : null}
      </div>
    </div>
  );
};

export default DharmaForm;
