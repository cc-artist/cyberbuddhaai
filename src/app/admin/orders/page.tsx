'use client';

import React, { useState, useEffect } from 'react';
import RequireAuth from '../../../components/RequireAuth';

interface OrderData {
  id: string;
  user: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentPlatform: 'paypal' | 'pingpong' | 'unknown';
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 通过API获取订单数据
      const response = await fetch('/api/admin/payments');
      if (!response.ok) {
        throw new Error('获取订单数据失败');
      }
      
      const data = await response.json();
      const filteredData = data.payments || [];

      if (filterStatus !== 'all') {
        setOrders(filteredData.filter((o: OrderData) => o.status === filterStatus));
      } else {
        setOrders(filteredData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取订单数据失败');
    } finally {
      setLoading(false);
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
      case 'pingpong': return 'PingPong';
      default: return '未知平台';
    }
  };

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总订单数</h3>
            <i className="fas fa-shopping-cart text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{totalOrders}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">已完成订单</h3>
            <i className="fas fa-check-circle text-[#34C759]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{completedOrders}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">待处理订单</h3>
            <i className="fas fa-clock text-[#FFD700]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{pendingOrders}</div>
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

      {/* 订单列表 */}
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
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#86868B]">
                    暂无订单记录
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C]">
                    <td className="text-white py-4 px-6">{order.id}</td>
                    <td className="text-[#86868B] py-4 px-6">{order.user}</td>
                    <td className="text-white font-medium py-4 px-6">¥{order.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${order.paymentPlatform === 'paypal' ? 'bg-blue-500/30 text-blue-300' : order.paymentPlatform === 'pingpong' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                        {getPlatformLabel(order.paymentPlatform)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="text-[#86868B] py-4 px-6 text-sm">
                      {new Date(order.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="text-[#86868B] hover:text-white text-sm"
                      >
                        <i className="fas fa-eye mr-1"></i>查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情弹窗 */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2E] rounded-xl p-6 max-w-lg w-full border border-[#48484A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">订单详情</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="text-[#86868B] hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#86868B] text-sm mb-1">订单号</label>
                <p className="text-white font-mono">{selectedOrder.id}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">用户</label>
                <p className="text-white">{selectedOrder.user}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">金额</label>
                <p className="text-white text-xl font-bold">¥{selectedOrder.amount}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">支付平台</label>
                <span className={`px-3 py-1 rounded-full text-xs ${selectedOrder.paymentPlatform === 'paypal' ? 'bg-blue-500/30 text-blue-300' : selectedOrder.paymentPlatform === 'pingpong' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                  {getPlatformLabel(selectedOrder.paymentPlatform)}
                </span>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">状态</label>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">创建时间</label>
                <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="w-full bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-2 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrdersPageWrapper() {
  return (
    <RequireAuth>
      <OrdersPage />
    </RequireAuth>
  );
}
