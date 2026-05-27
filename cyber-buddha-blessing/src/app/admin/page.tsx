'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalRevenue: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalConsultations: number;
  pendingConsultations: number;
  totalComments: number;
  approvedComments: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    totalComments: 0,
    approvedComments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      // 获取支付统计
      const paymentResponse = await fetch('/api/admin/payments');
      const paymentData = paymentResponse.ok ? await paymentResponse.json() : { payments: [] };
      const payments = paymentData.payments || [];
      
      const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const completedPayments = payments.filter((p: any) => p.status === 'completed').length;
      const pendingPayments = payments.filter((p: any) => p.status === 'pending').length;

      // 获取咨询统计
      const consultationResponse = await fetch('/api/contact');
      const consultations = consultationResponse.ok ? await consultationResponse.json() : [];
      const pendingConsultations = consultations.filter((c: any) => c.status === 'pending').length;

      // 获取评论统计
      const commentResponse = await fetch('/api/admin/comments');
      const commentData = commentResponse.ok ? await commentResponse.json() : { comments: [] };
      const comments = commentData.comments || [];
      const approvedComments = comments.filter((c: any) => c.approved).length;

      setStats({
        totalRevenue,
        totalPayments: payments.length,
        completedPayments,
        pendingPayments,
        totalConsultations: consultations.length,
        pendingConsultations,
        totalComments: comments.length,
        approvedComments
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8676B6]/30 border-t-[#8676B6] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#86868B]">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-circle text-4xl mb-4 text-[#FF3B30]"></i>
        <p className="text-[#FF3B30]">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: '总收入',
      value: `¥${stats.totalRevenue.toLocaleString()}`,
      icon: 'fas fa-wallet',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      link: '/admin/payments'
    },
    {
      title: '总订单数',
      value: stats.totalPayments,
      icon: 'fas fa-file-invoice',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      link: '/admin/orders'
    },
    {
      title: '已完成订单',
      value: stats.completedPayments,
      icon: 'fas fa-check-circle',
      color: '#34C759',
      bgColor: 'bg-[#34C759]/30',
      link: '/admin/orders'
    },
    {
      title: '待处理订单',
      value: stats.pendingPayments,
      icon: 'fas fa-clock',
      color: '#FFD700',
      bgColor: 'bg-[#FFD700]/30',
      link: '/admin/orders'
    },
    {
      title: '总咨询数',
      value: stats.totalConsultations,
      icon: 'fas fa-comments',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      link: '/admin/consultations'
    },
    {
      title: '待处理咨询',
      value: stats.pendingConsultations,
      icon: 'fas fa-comment-dots',
      color: '#FFD700',
      bgColor: 'bg-[#FFD700]/30',
      link: '/admin/consultations'
    },
    {
      title: '总评论数',
      value: stats.totalComments,
      icon: 'fas fa-message-circle',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      link: '/admin/comments'
    },
    {
      title: '已审核评论',
      value: stats.approvedComments,
      icon: 'fas fa-thumbs-up',
      color: '#34C759',
      bgColor: 'bg-[#34C759]/30',
      link: '/admin/comments'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <div className="bg-gradient-to-r from-[#8676B6]/20 to-[#FFD700]/10 rounded-2xl p-6 border border-[#8676B6]/30">
        <h1 className="text-2xl font-bold text-white mb-2">欢迎回到管理后台</h1>
        <p className="text-[#86868B]">查看实时数据统计和管理各项业务</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} href={card.link} className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A] hover:shadow-lg hover:border-[#8676B6]/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#86868B] text-sm">{card.title}</h3>
              <div className={`${card.bgColor} rounded-full p-2`}>
                <i className={card.icon} style={{ color: card.color }}></i>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
          </Link>
        ))}
      </div>

      {/* 最近活动 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/payments" className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A] hover:border-[#8676B6]/50 transition-all">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            最近支付
            <i className="fas fa-arrow-right ml-2 text-[#8676B6] text-sm"></i>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg hover:bg-[#1D1D1F]/80 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                  <i className="fas fa-user-circle text-[#8676B6]"></i>
                </div>
                <div>
                  <p className="text-white text-sm">张三</p>
                  <p className="text-[#86868B] text-xs">¥100 · PayPal</p>
                </div>
              </div>
              <span className="text-[#34C759] text-xs">已完成</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg hover:bg-[#1D1D1F]/80 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                  <i className="fas fa-user-circle text-[#8676B6]"></i>
                </div>
                <div>
                  <p className="text-white text-sm">李四</p>
                  <p className="text-[#86868B] text-xs">¥200 · PayPal</p>
                </div>
              </div>
              <span className="text-[#FFD700] text-xs">待处理</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg hover:bg-[#1D1D1F]/80 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                  <i className="fas fa-user-circle text-[#8676B6]"></i>
                </div>
                <div>
                  <p className="text-white text-sm">王五</p>
                  <p className="text-[#86868B] text-xs">¥150 · PingPong</p>
                </div>
              </div>
              <span className="text-[#34C759] text-xs">已完成</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/consultations" className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A] hover:border-[#8676B6]/50 transition-all">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            最近咨询
            <i className="fas fa-arrow-right ml-2 text-[#8676B6] text-sm"></i>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg hover:bg-[#1D1D1F]/80 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                  <i className="fas fa-user-circle text-[#8676B6]"></i>
                </div>
                <div>
                  <p className="text-white text-sm">赵六</p>
                  <p className="text-[#86868B] text-xs">关于寺庙预约...</p>
                </div>
              </div>
              <span className="text-[#FFD700] text-xs">待处理</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg hover:bg-[#1D1D1F]/80 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                  <i className="fas fa-user-circle text-[#8676B6]"></i>
                </div>
                <div>
                  <p className="text-white text-sm">孙七</p>
                  <p className="text-[#86868B] text-xs">关于开光服务...</p>
                </div>
              </div>
              <span className="text-[#34C759] text-xs">已回复</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg hover:bg-[#1D1D1F]/80 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                  <i className="fas fa-user-circle text-[#8676B6]"></i>
                </div>
                <div>
                  <p className="text-white text-sm">周八</p>
                  <p className="text-[#86868B] text-xs">关于账单问题...</p>
                </div>
              </div>
              <span className="text-[#86868B] text-xs">已关闭</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
