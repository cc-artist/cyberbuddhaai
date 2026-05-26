'use client';

import React, { useState, useEffect } from 'react';

interface PaymentData {
  id: string;
  user: string;
  amount: number;
  currency: 'CNY' | 'USD' | 'EUR' | 'GBP' | 'JPY';
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  paymentPlatform: 'paypal' | 'unknown';
  createdAt: string;
  updatedAt: string;
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editCurrency, setEditCurrency] = useState<'CNY' | 'USD' | 'EUR' | 'GBP' | 'JPY'>('CNY');
  const [editStatus, setEditStatus] = useState<'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded'>('pending');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 通过API获取支付数据
      const response = await fetch('/api/admin/payments');
      if (!response.ok) {
        throw new Error('获取支付数据失败');
      }
      
      const data = await response.json();
      const filteredData = data.payments || [];

      if (filterStatus !== 'all') {
        setPayments(filteredData.filter((p: PaymentData) => p.status === filterStatus));
      } else {
        setPayments(filteredData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取支付数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setEditAmount(payment.amount.toString());
    setEditCurrency(payment.currency || 'CNY');
    setEditStatus(payment.status);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedPayment) return;
    
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPayment.id,
          amount: parseFloat(editAmount),
          currency: editCurrency,
          status: editStatus
        })
      });

      if (!response.ok) throw new Error('更新支付记录失败');

      // 更新本地数据
      setPayments(payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, amount: parseFloat(editAmount), currency: editCurrency, status: editStatus }
          : p
      ));
      
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (err) {
      alert('更新支付记录失败');
    }
  };

  const handleDelete = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments?id=${encodeURIComponent(paymentId)}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('删除支付记录失败');

      setPayments(payments.filter(p => p.id !== paymentId));
      setConfirmDelete(null);
      
      if (selectedPayment?.id === paymentId) {
        setIsModalOpen(false);
      }
    } catch (err) {
      alert('删除支付记录失败');
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

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'paypal': return 'PayPal';
      default: return '未知平台';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'paypal': return 'bg-blue-500/30 text-blue-300';
      default: return 'bg-gray-500/30 text-gray-300';
    }
  };

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

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter(p => p.status === 'completed').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总收入</h3>
            <i className="fas fa-wallet text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRevenue, 'CNY')}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总订单数</h3>
            <i className="fas fa-file-invoice text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{payments.length}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">已完成</h3>
            <i className="fas fa-check-circle text-[#34C759]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{completedCount}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">待处理</h3>
            <i className="fas fa-clock text-[#FFD700]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{pendingCount}</div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-[#2C2C2E] rounded-xl p-4 border border-[#48484A]">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">筛选条件</h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
          >
            <option value="all">全部状态</option>
            <option value="completed">已完成</option>
            <option value="pending">待处理</option>
            <option value="failed">失败</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* 支付列表 */}
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
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#86868B]">
                    <i className="fas fa-spinner fa-spin text-xl mr-2"></i>
                    加载中...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#FF3B30]">
                    {error}
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#86868B]">
                    暂无支付记录
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C]">
                    <td className="text-white py-4 px-6">{payment.id}</td>
                    <td className="text-[#86868B] py-4 px-6">{payment.user}</td>
                    <td className="text-white font-medium py-4 px-6">{formatCurrency(payment.amount, payment.currency || 'CNY')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${getPlatformColor(payment.paymentPlatform)}`}>
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
                    <td className="py-4 px-6 space-x-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="text-[#86868B] hover:text-white text-sm"
                      >
                        <i className="fas fa-eye mr-1"></i>查看
                      </button>
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-[#8676B6] hover:text-[#7a68a6] text-sm"
                      >
                        <i className="fas fa-edit mr-1"></i>编辑
                      </button>
                      {confirmDelete === payment.id ? (
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="text-[#FF3B30] hover:text-red-400 text-sm"
                          >
                            确认
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-[#86868B] hover:text-white text-sm"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(payment.id)}
                          className="text-[#FF3B30] hover:text-red-400 text-sm"
                        >
                          <i className="fas fa-trash mr-1"></i>删除
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情弹窗 */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2E] rounded-xl p-6 max-w-lg w-full border border-[#48484A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {isEditing ? '编辑支付记录' : '支付详情'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPayment(null);
                  setIsEditing(false);
                }}
                className="text-[#86868B] hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#86868B] text-sm mb-1">订单号</label>
                <p className="text-white font-mono">{selectedPayment.id}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">用户</label>
                <p className="text-white">{selectedPayment.user}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">金额</label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="flex-1 bg-[#1D1D1F] border border-[#48484A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                    />
                    <select
                      value={editCurrency}
                      onChange={(e) => setEditCurrency(e.target.value as any)}
                      className="bg-[#1D1D1F] border border-[#48484A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                    >
                      <option value="CNY">CNY (¥)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-white text-xl font-bold">{formatCurrency(selectedPayment.amount, selectedPayment.currency || 'CNY')}</p>
                )}
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">支付平台</label>
                <span className={`px-3 py-1 rounded-full text-xs ${getPlatformColor(selectedPayment.paymentPlatform)}`}>
                  {getPlatformLabel(selectedPayment.paymentPlatform)}
                </span>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">状态</label>
                {isEditing ? (
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                  >
                    <option value="pending">待处理</option>
                    <option value="completed">已完成</option>
                    <option value="failed">失败</option>
                    <option value="cancelled">已取消</option>
                    <option value="refunded">已退款</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusLabel(selectedPayment.status)}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">创建时间</label>
                <p className="text-white">{new Date(selectedPayment.createdAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-[#3A3A3C] hover:bg-[#48484A] text-white py-2 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-2 rounded-lg transition-colors"
                  >
                    保存
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-2 rounded-lg transition-colors"
                >
                  关闭
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
