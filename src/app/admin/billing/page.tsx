'use client';

import React, { useState, useEffect } from 'react';
import RequireAuth from '../../../components/RequireAuth';

interface PaymentData {
  id: string;
  user: string;
  amount: number;
  status: string;
  paymentPlatform: string;
  createdAt: string;
}

const BillingPage = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 通过API获取支付数据
      const response = await fetch('/api/admin/payments');
      if (!response.ok) {
        throw new Error('获取账单数据失败');
      }
      
      const data = await response.json();
      const paymentList = data.payments || [];

      setPayments(paymentList);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取账单数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPayments = () => {
    let filtered = [...payments];
    
    if (startDate) {
      filtered = filtered.filter(p => new Date(p.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      filtered = filtered.filter(p => new Date(p.createdAt) <= end);
    }
    
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(p => p.paymentPlatform === filterPlatform);
    }
    
    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  const stats = {
    totalRevenue: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
    totalOrders: filteredPayments.length,
    completedOrders: filteredPayments.filter(p => p.status === 'completed').length,
    paypalRevenue: filteredPayments.filter(p => p.paymentPlatform === 'paypal').reduce((sum, p) => sum + p.amount, 0),
    pingpongRevenue: filteredPayments.filter(p => p.paymentPlatform === 'pingpong').reduce((sum, p) => sum + p.amount, 0)
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'paypal': return 'PayPal';
      case 'pingpong': return 'PingPong';
      default: return '未知平台';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'pending': return '待处理';
      case 'failed': return '失败';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/30 text-green-300';
      case 'pending': return 'bg-yellow-500/30 text-yellow-300';
      case 'failed': return 'bg-red-500/30 text-red-300';
      case 'cancelled': return 'bg-gray-500/30 text-gray-300';
      default: return 'bg-gray-500/30 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总收入</h3>
            <i className="fas fa-wallet text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">¥{stats.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总订单数</h3>
            <i className="fas fa-file-invoice text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">已完成订单</h3>
            <i className="fas fa-check-circle text-[#34C759]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.completedOrders}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">PayPal收入</h3>
            <i className="fas fa-credit-card text-blue-400"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">¥{stats.paypalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">PingPong收入</h3>
            <i className="fas fa-credit-card text-green-400"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">¥{stats.pingpongRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-[#2C2C2E] rounded-xl p-4 border border-[#48484A]">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-[#86868B] text-sm mb-1">开始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
            />
          </div>
          <div>
            <label className="block text-[#86868B] text-sm mb-1">结束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
            />
          </div>
          <div>
            <label className="block text-[#86868B] text-sm mb-1">支付平台</label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
            >
              <option value="all">全部平台</option>
              <option value="paypal">PayPal</option>
              <option value="pingpong">PingPong</option>
            </select>
          </div>
        </div>
      </div>

      {/* 账单列表 */}
      <div className="bg-[#2C2C2E] rounded-xl border border-[#48484A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#48484A]">
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">订单号</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">用户</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">金额</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">支付平台</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">状态</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#86868B]">
                    <i className="fas fa-spinner fa-spin text-xl mr-2"></i>
                    加载中...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#FF3B30]">
                    {error}
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#86868B]">
                    暂无账单记录
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C]">
                    <td className="text-white py-4 px-6">{payment.id}</td>
                    <td className="text-[#86868B] py-4 px-6">{payment.user}</td>
                    <td className="text-white font-medium py-4 px-6">¥{payment.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${payment.paymentPlatform === 'paypal' ? 'bg-blue-500/30 text-blue-300' : payment.paymentPlatform === 'pingpong' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                        {getPlatformLabel(payment.paymentPlatform)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="text-[#86868B] py-4 px-6 text-sm">
                      {new Date(payment.createdAt).toLocaleString('zh-CN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function BillingPageWrapper() {
  return (
    <RequireAuth>
      <BillingPage />
    </RequireAuth>
  );
}
