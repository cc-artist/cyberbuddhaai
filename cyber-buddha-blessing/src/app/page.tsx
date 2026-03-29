'use client';

import React, { useState, useEffect, Suspense } from 'react';
import NextImage from 'next/image';
import { Temple, temples as staticTemples } from '../data/TempleData';

// 动态导入组件，实现代码分割
const TempleFilmStrip = React.lazy(() => import('../components/TempleFilmStrip'));
const TempleDetailModal = React.lazy(() => import('../components/TempleDetailModal'));
const Consecration = React.lazy(() => import('../components/Consecration'));
const DharmaForm = React.lazy(() => import('../components/DharmaForm'));
const LampBlessing = React.lazy(() => import('../components/LampBlessing'));
const CommentScroll = React.lazy(() => import('../components/CommentScroll'));

// Static generation for homepage for better performance
export const dynamic = 'force-static';

export default function Home() {
  const [temples, setTemples] = useState<Temple[]>(staticTemples);
  
  // 从API获取寺庙数据
  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await fetch('/api/public/temples', {
          cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          setTemples(data);
        }
      } catch (error) {
        console.error('Failed to fetch temples:', error);
        // 使用静态数据作为备选
        setTemples(staticTemples);
      }
    };
    
    fetchTemples();
  }, []);
  
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('blessing');
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleTempleClick = (temple: Temple) => {
    setSelectedTemple(temple);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedTemple(null);
    }, 300);
  };

  const handleOpenContactForm = () => {
    setIsContactFormOpen(true);
  };

  const handleCloseContactForm = () => {
    setIsContactFormOpen(false);
  };

  const handlePayment = async () => {
    console.log('Payment requested for:', selectedTemple?.name);
    
    // 防止重复提交
    if (isPaying) return;
    
    try {
      setIsPaying(true);
      
      // 获取支付配置
      const paymentConfigRes = await fetch('/api/payment', {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      const paymentConfig = await paymentConfigRes.json();
      
      // 这里可以添加实际的支付逻辑，使用安全的支付配置
      console.log('[API] 支付配置:', paymentConfig);
      
      // 模拟成功响应
      console.log('[API] 支付成功');
      alert('Payment successful! Your custom tour has been confirmed, we will send detailed itinerary to your email within 3 working days.');
    } catch (error) {
      console.error('支付失败:', error);
      alert('Payment failed, please try again later or contact customer service');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D1D1F] text-[#F5F5F7] font-sans overflow-x-hidden">


      {/* Hero Section */}
      <header className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Golden Particle Halo Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-gradient-to-r from-[#FFD700]/10 via-[#8676B6]/10 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-l from-[#FFD700]/10 via-[#8676B6]/10 to-transparent animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-t from-[#FFD700]/20 via-[#8676B6]/20 to-transparent animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
        </div>

        {/* Cyber Buddha Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <NextImage
            src="/temple-images/赛博佛祖背景图.png"
            alt="Cyber Buddha meditating with golden light"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 20%' }}
            priority
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F7] via-[#8676B6] to-[#FFD700] animate-pulse">
            Cyber Buddha
          </h1>
          <p className="text-base md:text-xl lg:text-3xl mb-8 md:mb-10 text-[#F5F5F7]/90">
            Cyber Buddha Digital Blessing · Dharma Form · Lamp Blessing · Custom Tours of Famous Chinese Temples
          </p>
          <a 
            href="#features" 
            className="inline-block bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            aria-label="Begin your digital blessing journey"
          >
            Begin Your Blessing
          </a>
        </div>
      </header>

      {/* Core Features Module */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Function Tabs */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#F5F5F7]">Core Features</h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4" role="tablist" aria-label="Core Features">
            <button
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${activeTab === 'blessing' ? 'bg-[#8676B6] text-white shadow-lg' : 'bg-[#1D1D1F]/50 border border-[#8676B6]/30 text-[#8676B6] hover:border-[#8676B6]/60'}`}
              onClick={() => setActiveTab('blessing')} // 移动端使用点击事件代替悬停
              onMouseEnter={() => setActiveTab('blessing')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('blessing');
                }
              }}
              role="tab"
              aria-selected={activeTab === 'blessing'}
              aria-controls="blessing-panel"
              id="blessing-tab"
              tabIndex={activeTab === 'blessing' ? 0 : -1}
            >
              Digital Blessing
            </button>
            <button
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${activeTab === 'dharma' ? 'bg-[#8676B6] text-white shadow-lg' : 'bg-[#1D1D1F]/50 border border-[#8676B6]/30 text-[#8676B6] hover:border-[#8676B6]/60'}`}
              onClick={() => setActiveTab('dharma')}
              onMouseEnter={() => setActiveTab('dharma')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('dharma');
                }
              }}
              role="tab"
              aria-selected={activeTab === 'dharma'}
              aria-controls="dharma-panel"
              id="dharma-tab"
              tabIndex={activeTab === 'dharma' ? 0 : -1}
            >
              Dharma Form
            </button>
            <button
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${activeTab === 'lamp' ? 'bg-[#8676B6] text-white shadow-lg' : 'bg-[#1D1D1F]/50 border border-[#8676B6]/30 text-[#8676B6] hover:border-[#8676B6]/60'}`}
              onClick={() => setActiveTab('lamp')}
              onMouseEnter={() => setActiveTab('lamp')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('lamp');
                }
              }}
              role="tab"
              aria-selected={activeTab === 'lamp'}
              aria-controls="lamp-panel"
              id="lamp-tab"
              tabIndex={activeTab === 'lamp' ? 0 : -1}
            >
              Lamp Blessing
            </button>
            <button
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${activeTab === 'temple' ? 'bg-[#8676B6] text-white shadow-lg' : 'bg-[#1D1D1F]/50 border border-[#8676B6]/30 text-[#8676B6] hover:border-[#8676B6]/60'}`}
              onClick={() => setActiveTab('temple')}
              onMouseEnter={() => setActiveTab('temple')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('temple');
                }
              }}
              role="tab"
              aria-selected={activeTab === 'temple'}
              aria-controls="temple-panel"
              id="temple-tab"
              tabIndex={activeTab === 'temple' ? 0 : -1}
            >
              Temple Tours
            </button>
          </div>
        </div>

          {/* Feature Content */}
          <div className="space-y-10">
            {activeTab === 'blessing' && (
              <div id="blessing-panel" role="tabpanel" aria-labelledby="blessing-tab" tabIndex={0}>
                <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}>
                  <Consecration />
                </Suspense>
              </div>
            )}
            {activeTab === 'dharma' && (
              <div id="dharma-panel" role="tabpanel" aria-labelledby="dharma-tab" tabIndex={0}>
                <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}>
                  <DharmaForm />
                </Suspense>
              </div>
            )}
            {activeTab === 'lamp' && (
              <div id="lamp-panel" role="tabpanel" aria-labelledby="lamp-tab" tabIndex={0}>
                <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}>
                  <LampBlessing />
                </Suspense>
              </div>
            )}
            {activeTab === 'temple' && (
              <div id="temple-panel" role="tabpanel" aria-labelledby="temple-tab" tabIndex={0}>
                <div>
                  <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold mb-2 text-[#F5F5F7]">Custom Tours of Famous Chinese Temples</h3>
                    <p className="text-[#F5F5F7]/70">Explore Chinese Buddhist cultural sites and customize your exclusive meditation journey</p>
                  </div>
                  <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}>
                    <TempleFilmStrip 
                      temples={temples} 
                    />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Shares Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1D1D1F] to-[#1D1D1F]/90">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading...</div>}>
            <CommentScroll />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D1D1F] border-t border-[#8676B6]/30 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-[#8676B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold">Cyber Buddha</h3>
              </div>
              <p className="text-[#F5F5F7]/70">
                Blending traditional culture with modern AI technology to bring you a unique digital meditation experience
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#F5F5F7]">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#F5F5F7]/70 hover:text-[#8676B6] transition-colors duration-300">Home</a></li>
                <li><a href="#" className="text-[#F5F5F7]/70 hover:text-[#8676B6] transition-colors duration-300">Cyber Buddha Digital Blessing</a></li>
                <li><a href="#" className="text-[#F5F5F7]/70 hover:text-[#8676B6] transition-colors duration-300">Request Dharma Form</a></li>
                <li><a href="#" className="text-[#F5F5F7]/70 hover:text-[#8676B6] transition-colors duration-300">Lamp Blessing</a></li>
                <li><a href="#" className="text-[#F5F5F7]/70 hover:text-[#8676B6] transition-colors duration-300">Custom Temple Tours</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#F5F5F7]">Contact Us</h3>
              <p className="text-[#F5F5F7]/70">Email: cherry.hou@hotmail.com</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#8676B6]/30 text-center text-[#F5F5F7]/50 text-sm">
            <p>© 2026 Cyber Buddha. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Temple Detail Modal */}
      <Suspense fallback={<div></div>}>
        <TempleDetailModal 
          temple={selectedTemple} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onPayment={handlePayment} 
          isContactFormOpen={isContactFormOpen}
          onOpenContactForm={handleOpenContactForm}
          onCloseContactForm={handleCloseContactForm}
          isPaying={isPaying}
        />
      </Suspense>
    </div>
  );
}
