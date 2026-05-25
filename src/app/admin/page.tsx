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

interface PaymentRecord {
  id: string;
  user: string;
  amount: number;
  currency: 'CNY' | 'USD' | 'EUR' | 'GBP' | 'JPY';
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  paymentPlatform: 'paypal' | 'pingpong' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
}

interface ConsultationRecord {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  templeName: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
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
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      CNY: '¥',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥'
    };
    const symbol = currencySymbols[currency] || '¥';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: '已完成',
      pending: '待处理',
      failed: '失败',
      cancelled: '已取消',
      refunded: '已退款'
    };
    return statusMap[status] || status;
  };

  const formatPlatform = (platform: string) => {
    const platformMap: Record<string, string> = {
      paypal: 'PayPal',
      pingpong: 'PingPong',
      unknown: '未知'
    };
    return platformMap[platform] || platform;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      completed: '#34C759',
      pending: '#FFD700',
      failed: '#FF3B30',
      cancelled: '#86868B',
      refunded: '#FF9500'
    };
    return colorMap[status] || '#86868B';
  };

  const formatConsultationStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待处理',
      replied: '已回复',
      closed: '已关闭'
    };
    return statusMap[status] || status;
  };

  const getConsultationStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: '#FFD700',
      replied: '#34C759',
      closed: '#86868B'
    };
    return colorMap[status] || '#86868B';
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      // 获取支付统计
      const paymentResponse = await fetch('/api/admin/payments');
      const paymentData = paymentResponse.ok ? await paymentResponse.json() : { payments: [] };
      const allPayments = paymentData.payments || [];
      
      const totalRevenue = allPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      const completedPayments = allPayments.filter((p: any) => p.status === 'completed').length;
      const pendingPayments = allPayments.filter((p: any) => p.status === 'pending').length;

      // 获取最近3条支付记录
      const recentPayments = allPayments.slice(0, 3);
      setPayments(recentPayments);

      // 获取咨询统计
      const consultationResponse = await fetch('/api/contact');
      const consultations = consultationResponse.ok ? await consultationResponse.json() : [];
      const pendingConsultations = consultations.filter((c: any) => c.status === 'pending').length;
      
      // 获取最近3条咨询记录
      const recentConsultations = consultations.slice(0, 3);
      setConsultations(recentConsultations);

      // 获取评论统计
      const commentResponse = await fetch('/api/admin/comments');
      const commentData = commentResponse.ok ? await commentResponse.json() : { comments: [] };
      const comments = commentData.comments || [];
      const approvedComments = comments.filter((c: any) => c.approved).length;

      setStats({
        totalRevenue,
        totalPayments: allPayments.length,
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
      value: formatCurrency(stats.totalRevenue, 'CNY'),
      icon: 'fas fa-wallet',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      linkPath: '/admin/payments'
    },
    {
      title: '总订单数',
      value: stats.totalPayments,
      icon: 'fas fa-file-invoice',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      linkPath: '/admin/payments'
    },
    {
      title: '已完成订单',
      value: stats.completedPayments,
      icon: 'fas fa-check-circle',
      color: '#34C759',
      bgColor: 'bg-[#34C759]/30',
      linkPath: '/admin/payments'
    },
    {
      title: '待处理订单',
      value: stats.pendingPayments,
      icon: 'fas fa-clock',
      color: '#FFD700',
      bgColor: 'bg-[#FFD700]/30',
      linkPath: '/admin/payments'
    },
    {
      title: '总咨询数',
      value: stats.totalConsultations,
      icon: 'fas fa-comments',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      linkPath: '/admin/consultations'
    },
    {
      title: '待处理咨询',
      value: stats.pendingConsultations,
      icon: 'fas fa-comment-dots',
      color: '#FFD700',
      bgColor: 'bg-[#FFD700]/30',
      linkPath: '/admin/consultations'
    },
    {
      title: '总评论数',
      value: stats.totalComments,
      icon: 'fas fa-message-circle',
      color: '#8676B6',
      bgColor: 'bg-[#8676B6]/30',
      linkPath: '/admin/comments'
    },
    {
      title: '已审核评论',
      value: stats.approvedComments,
      icon: 'fas fa-thumbs-up',
      color: '#34C759',
      bgColor: 'bg-[#34C759]/30',
      linkPath: '/admin/comments'
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
          <Link key={index} href={card.linkPath}>
            <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A] hover:shadow-lg hover:bg-[#3A3A3C] hover:border-[#8676B6]/50 cursor-pointer transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#86868B] text-sm">{card.title}</h3>
                <div className={`${card.bgColor} rounded-full p-2`}>
                  <i className={card.icon} style={{ color: card.color }}></i>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{card.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
        <h3 className="text-lg font-semibold text-white mb-4">快捷操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/consultations" className="flex flex-col items-center p-4 rounded-xl bg-[#1D1D1F]/50 hover:bg-[#3A3A3C] hover:border-[#8676B6]/50 border border-transparent transition-all duration-300 cursor-pointer">
            <i className="fas fa-comments text-2xl text-[#8676B6] mb-2"></i>
            <span className="text-[#86868B] text-sm">咨询管理</span>
          </Link>
          <Link href="/admin/payments" className="flex flex-col items-center p-4 rounded-xl bg-[#1D1D1F]/50 hover:bg-[#3A3A3C] hover:border-[#8676B6]/50 border border-transparent transition-all duration-300 cursor-pointer">
            <i className="fas fa-credit-card text-2xl text-[#8676B6] mb-2"></i>
            <span className="text-[#86868B] text-sm">支付管理</span>
          </Link>
          <Link href="/admin/comments" className="flex flex-col items-center p-4 rounded-xl bg-[#1D1D1F]/50 hover:bg-[#3A3A3C] hover:border-[#8676B6]/50 border border-transparent transition-all duration-300 cursor-pointer">
            <i className="fas fa-comment-dots text-2xl text-[#8676B6] mb-2"></i>
            <span className="text-[#86868B] text-sm">评论管理</span>
          </Link>
          <Link href="/admin/billing" className="flex flex-col items-center p-4 rounded-xl bg-[#1D1D1F]/50 hover:bg-[#3A3A3C] hover:border-[#8676B6]/50 border border-transparent transition-all duration-300 cursor-pointer">
            <i className="fas fa-file-invoice text-2xl text-[#8676B6] mb-2"></i>
            <span className="text-[#86868B] text-sm">账单管理</span>
          </Link>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <h3 className="text-lg font-semibold text-white mb-4">最近支付</h3>
          <div className="space-y-3">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                      <i className="fas fa-user-circle text-[#8676B6]"></i>
                    </div>
                    <div>
                      <p className="text-white text-sm">{payment.user}</p>
                      <p className="text-[#86868B] text-xs">{formatCurrency(payment.amount, payment.currency)} · {formatPlatform(payment.paymentPlatform)}</p>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: getStatusColor(payment.status) }}>{formatStatus(payment.status)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-[#86868B]">暂无支付记录</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <h3 className="text-lg font-semibold text-white mb-4">最近咨询</h3>
          <div className="space-y-3">
            {consultations.length > 0 ? (
              consultations.map((consultation) => (
                <div key={consultation._id} className="flex items-center justify-between p-3 bg-[#1D1D1F]/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#8676B6]/30 flex items-center justify-center mr-3">
                      <i className="fas fa-user-circle text-[#8676B6]"></i>
                    </div>
                    <div>
                      <p className="text-white text-sm">{consultation.name}</p>
                      <p className="text-[#86868B] text-xs">{consultation.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: getConsultationStatusColor(consultation.status) }}>{formatConsultationStatus(consultation.status)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-[#86868B]">暂无咨询记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
