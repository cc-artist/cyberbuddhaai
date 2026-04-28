'use client';

import React, { useState, useEffect } from 'react';
import connectMongoDB from '../../../lib/mongodb';
import Comment from '../../../models/Comment';

interface CommentData {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  pageUrl: string;
  createdAt: string;
  userName: string;
  userComment: string;
  userAvatar: string;
  approved: boolean;
}

const CommentsPage = () => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      await connectMongoDB();
      const docs = await Comment.find().sort({ createdAt: -1 });
      
      const data = docs.map(doc => ({
        id: doc._id.toString(),
        imageUrl: doc.imageUrl,
        title: doc.title,
        description: doc.description,
        pageUrl: doc.pageUrl,
        createdAt: doc.createdAt.toISOString(),
        userName: doc.userName,
        userComment: doc.userComment,
        userAvatar: doc.userAvatar,
        approved: doc.approved || true
      }));

      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取评论数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await connectMongoDB();
      await Comment.findByIdAndDelete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      setConfirmDeleteId(null);
    } catch (err) {
      alert('删除评论失败');
    }
  };

  const handleApprove = async (commentId: string, approved: boolean) => {
    try {
      await connectMongoDB();
      await Comment.findByIdAndUpdate(commentId, { approved });
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, approved } : c
      ));
    } catch (err) {
      alert('更新评论状态失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">总评论数</h3>
            <i className="fas fa-comments text-[#8676B6]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{comments.length}</div>
        </div>
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#86868B] text-sm">已审核</h3>
            <i className="fas fa-check-circle text-[#34C759]"></i>
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {comments.filter(c => c.approved).length}
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-[#2C2C2E] rounded-xl border border-[#48484A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#48484A]">
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">用户</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">评论内容</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">图片预览</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">状态</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">创建时间</th>
                <th className="text-[#86868B] py-4 px-6 text-left text-sm font-medium">操作</th>
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
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#86868B]">
                    暂无评论记录
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C]">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <span className="text-white">{comment.userName}</span>
                      </div>
                    </td>
                    <td className="text-[#86868B] py-4 px-6 max-w-[300px] truncate">
                      {comment.userComment}
                    </td>
                    <td className="py-4 px-6">
                      <img
                        src={comment.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${comment.approved ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
                        {comment.approved ? '已审核' : '待审核'}
                      </span>
                    </td>
                    <td className="text-[#86868B] py-4 px-6 text-sm">
                      {new Date(comment.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleApprove(comment.id, !comment.approved)}
                        className="text-[#86868B] hover:text-white text-sm mr-3"
                      >
                        <i className={`fas ${comment.approved ? 'fa-times-circle' : 'fa-check-circle'} mr-1`}></i>
                        {comment.approved ? '取消审核' : '审核通过'}
                      </button>
                      {confirmDeleteId === comment.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(comment.id)}
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
                          onClick={() => setConfirmDeleteId(comment.id)}
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
    </div>
  );
};

export default CommentsPage;
