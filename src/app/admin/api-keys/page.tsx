'use client';

import React, { useState, useEffect } from 'react';

interface ApiKey {
  id: number;
  name: string;
  type: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

const ApiKeysPage = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [newKey, setNewKey] = useState({ name: '', type: '', value: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/api-keys');
      if (!response.ok) throw new Error('获取API密钥失败');
      const data = await response.json();
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取API密钥失败');
      // 使用模拟数据
      setApiKeys([
        {
          id: 1,
          name: 'OpenAI API Key',
          type: 'openai',
          value: process.env.NEXT_PUBLIC_OPENAI_API_KEY ? 'sk-********************' : '未配置',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'PayPal API Key',
          type: 'paypal',
          value: '********************',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newKey.name || !newKey.type || !newKey.value) {
      alert('请填写完整信息');
      return;
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey)
      });

      if (!response.ok) throw new Error('创建API密钥失败');
      const data = await response.json();
      setApiKeys([...apiKeys, data.apiKey]);
      setNewKey({ name: '', type: '', value: '' });
      setIsAddModalOpen(false);
    } catch (err) {
      alert('创建失败');
    }
  };

  const handleUpdate = async () => {
    if (!editingKey || !editingKey.name || !editingKey.value) {
      alert('请填写完整信息');
      return;
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingKey)
      });

      if (!response.ok) throw new Error('更新API密钥失败');
      setApiKeys(apiKeys.map(k => k.id === editingKey.id ? editingKey : k));
      setEditingKey(null);
      setIsEditModalOpen(false);
    } catch (err) {
      alert('更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('删除API密钥失败');
      setApiKeys(apiKeys.filter(k => k.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      alert('删除失败');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'openai': return 'OpenAI';
      case 'paypal': return 'PayPal';
      case 'pingpong': return 'PingPong';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="text-white text-xl font-bold">API密钥管理</div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#8676B6] hover:bg-[#8676B6]/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>添加密钥
        </button>
      </div>

      {/* API密钥列表 */}
      <div className="bg-[#2C2C2E] rounded-xl border border-[#48484A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#48484A]">
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">名称</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">类型</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">密钥值</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">创建时间</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#86868B]">
                    <i className="fas fa-spinner fa-spin text-xl mr-2"></i>
                    加载中...
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#86868B]">
                    暂无API密钥
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C]">
                    <td className="text-white py-4 px-6">{key.name}</td>
                    <td className="text-[#86868B] py-4 px-6">{getTypeLabel(key.type)}</td>
                    <td className="text-[#86868B] py-4 px-6 font-mono text-sm">{key.value}</td>
                    <td className="text-[#86868B] py-4 px-6 text-sm">
                      {new Date(key.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setEditingKey(key);
                          setIsEditModalOpen(true);
                        }}
                        className="text-[#86868B] hover:text-white text-sm mr-3"
                      >
                        <i className="fas fa-edit mr-1"></i>编辑
                      </button>
                      {confirmDeleteId === key.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="text-[#FF3B30] text-sm"
                          >
                            确认删除
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[#86868B] hover:text-white text-sm"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(key.id)}
                          className="text-[#FF3B30] hover:text-red-300 text-sm"
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

      {/* 添加弹窗 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2E] rounded-xl p-6 max-w-lg w-full border border-[#48484A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">添加API密钥</h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewKey({ name: '', type: '', value: '' });
                }}
                className="text-[#86868B] hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#86868B] text-sm mb-1">名称</label>
                <input
                  type="text"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                  placeholder="输入密钥名称"
                />
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">类型</label>
                <select
                  value={newKey.type}
                  onChange={(e) => setNewKey({ ...newKey, type: e.target.value })}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                >
                  <option value="">选择类型</option>
                  <option value="openai">OpenAI</option>
                  <option value="paypal">PayPal</option>
                  <option value="pingpong">PingPong</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">密钥值</label>
                <input
                  type="text"
                  value={newKey.value}
                  onChange={(e) => setNewKey({ ...newKey, value: e.target.value })}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                  placeholder="输入密钥值"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewKey({ name: '', type: '', value: '' });
                }}
                className="flex-1 bg-[#3A3A3C] hover:bg-[#48484A] text-white py-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-2 rounded-lg transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑弹窗 */}
      {isEditModalOpen && editingKey && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2C2C2E] rounded-xl p-6 max-w-lg w-full border border-[#48484A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">编辑API密钥</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingKey(null);
                }}
                className="text-[#86868B] hover:text-white"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#86868B] text-sm mb-1">名称</label>
                <input
                  type="text"
                  value={editingKey.name}
                  onChange={(e) => setEditingKey({ ...editingKey, name: e.target.value })}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                />
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">类型</label>
                <select
                  value={editingKey.type}
                  onChange={(e) => setEditingKey({ ...editingKey, type: e.target.value })}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6]"
                >
                  <option value="openai">OpenAI</option>
                  <option value="paypal">PayPal</option>
                  <option value="pingpong">PingPong</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-[#86868B] text-sm mb-1">密钥值</label>
                <input
                  type="text"
                  value={editingKey.value}
                  onChange={(e) => setEditingKey({ ...editingKey, value: e.target.value })}
                  className="w-full bg-[#1D1D1F] border border-[#48484A] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#8676B6] font-mono"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingKey(null);
                }}
                className="flex-1 bg-[#3A3A3C] hover:bg-[#48484A] text-white py-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 bg-[#8676B6] hover:bg-[#8676B6]/90 text-white py-2 rounded-lg transition-colors"
              >
                更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeysPage;
