'use client';

import React, { useState, useEffect } from 'react';

interface ConsultationData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  templeName: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, [filterStatus]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 通过API获取咨询数据
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('获取咨询数据失败');
      }
      
      const data = await response.json();
      const filteredData = Array.isArray(data) ? data : [];

      const formattedData: ConsultationData[] = filteredData.map((item: any) => ({
        id: item._id || item.id,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        templeName: item.templeName || '未知寺庙',
        status: (item.status || 'pending') as 'pending' | 'replied' | 'closed',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));

      if (filterStatus !== 'all') {
        setConsultations(formattedData.filter(c => c.status === filterStatus));
      } else {
        setConsultations(formattedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取咨询数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedConsultation || !newStatus) return;

    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedConsultation.id, status: newStatus })
      });

      if (!response.ok) throw new Error('更新状态失败');

      setConsultations(consultations.map(c => 
        c.id === selectedConsultation.id ? { ...c, status: newStatus as 'pending' | 'replied' | 'closed' } : c
      ));
      setIsModalOpen(false);
      setSelectedConsultation(null);
      setNewStatus('');
    } catch (err) {
      alert('更新状态失败');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'replied': return '已回复';
      case 'closed': return '已关闭';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/30 text-yellow-300';
      case 'replied': return 'bg-green-500/30 text-green-300';
      case 'closed': return 'bg-gray-500/30 text-gray-300';
      default: return 'bg-gray-500/30 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总咨询数</h3>
            <i className="fas fa-comments text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{consultations.length}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">待处理</h3>
            <i className="fas fa-clock text-[#FFD700]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {consultations.filter(c => c.status === 'pending').length}
          </div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">已回复</h3>
            <i className="fas fa-check-circle text-[#34C759]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {consultations.filter(c => c.status === 'replied').length}
          </div>
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
            <option value="pending">待处理</option>
            <option value="replied">已回复</option>
            <option value="closed">已关闭</option>
          </select>
        </div>
      </div>

      {/* 咨询列表 */}
      <div className="bg-[#2C2C2E] rounded-xl border border-[#48484A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#48484A]">
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">姓名</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">邮箱</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">主题</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">寺庙</th>
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
              ) : consultations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#86868B]">
                    暂无咨询记录
                  </td>
                </tr>
              ) : (
                consultations.map((consultation) => (
                  <tr key={consultation.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C]">
                    <td className="text-white py-4 px-6">{consultation.name}</td>
                    <td className="text-[#86868B] py-4 px-6">{consultation.email}</td>
                    <td className="text-[#86868B] py-4 px-6 max-w-[200px] truncate">{consultation.subject}</td>
                    <td className="text-[#86868B] py-4 px-6">{consultation.templeName}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(consultation.status)}`}>
                        {getStatusLabel(consultation.status)}
                      </span>
                    </td>
                    <td className="text-[#86868B] py-4 px-6 text-sm">
                      {new Date(consultation.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedConsultation(consultation);
                          setNewStatus(consultation.status);
                          setIsModalOpen(true);
                        }}
                        className="text-[#86868B] hover:text-white text-sm mr-3"
                      >
                        <i className="fas fa-eye mr-1"></i>查看
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
      {isModalOpen && selectedConsultation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2E] rounded-xl p-6 max-w-lg w-full border border-[#48484A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">咨询详情</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedConsultation(null);
                }}
                className="text-[#86868B] hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#86868B] text-sm mb-1">姓名</label>
                <p className="text-white">{selectedConsultation.name}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">邮箱</label>
                <p className="text-white">{selectedConsultation.email}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">主题</label>
                <p className="text-white">{selectedConsultation.subject}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">寺庙</label>
                <p className="text-white">{selectedConsultation.templeName}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">咨询内容</label>
                <p className="text-white">{selectedConsultation.message}</p>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">当前状态</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                >
                  <option value="pending">待处理</option>
                  <option value="replied">已回复</option>
                  <option value="closed">已关闭</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedConsultation(null);
                }}
                className="flex-1 bg-[#3A3A3C] hover:bg-[#48484A] text-white py-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-2 rounded-lg transition-colors"
              >
                更新状态
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
