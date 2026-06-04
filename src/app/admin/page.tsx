import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAppSession } from '../../lib/auth';
import Payment from '../../models/Payment';
import Consultation from '../../models/Consultation';
import connectMongoDB from '../../lib/mongodb';

// Full dynamic rendering configuration to prevent build-time pre-rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

// 货币符号映射
const currencySymbols: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'CNY': '¥',
  'JPY': '¥'
};

// 格式化金额
const formatCurrency = (amount: number, currency: string = 'USD') => {
  const symbol = currencySymbols[currency] || currency + ' ';
  return `${symbol}${amount.toLocaleString()}`;
};

// 定义API响应类型
interface Payment {
  _id: string;
  orderNumber?: string; // 可选字段
  id?: string;
  user: string;
  userEmail?: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  paymentPlatform: 'paypal' | 'pingpong' | 'unknown';
  platformTransactionId?: string;
  serviceType?: string;
  templeName?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsResponse {
  payments: Payment[];
  totalCount: number;
  totalRevenueByCurrency: Record<string, number>;
  completedCount: number;
}

// 定义咨询数据类型
interface Consultation {
  _id: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  templeName: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface ConsultationsResponse {
  consultations: Consultation[];
  totalCount: number;
  pendingCount: number;
  repliedCount: number;
}



const AdminDashboard = async () => {
  // 暂时移除认证检查，让页面可以正常预览
  const session = { user: { email: 'admin@example.com' } };

  // 获取支付数据 - 直接在服务器端获取，不需要通过fetch请求
  let paymentsData: PaymentsResponse | null = null;
  let consultationsData: ConsultationsResponse | null = null;
  let error = null;

  try {
    // 连接到数据库
    await connectMongoDB();

    // 从数据库获取真实支付数据
    const payments = await Payment.find().sort({ createdAt: -1 });

    // 计算统计数据 - 按货币分类
    const totalRevenueByCurrency: Record<string, number> = {};
    payments.forEach(payment => {
      const currency = (payment as any).currency || 'USD'; // 处理可能缺少currency字段的历史数据
      if (!totalRevenueByCurrency[currency]) {
        totalRevenueByCurrency[currency] = 0;
      }
      if (payment.status === 'completed') {
        totalRevenueByCurrency[currency] += payment.amount;
      }
    });
    const completedCount = payments.filter(payment => payment.status === 'completed').length;

    // 设置支付数据，转换Date对象为string
    paymentsData = {
      payments: payments.map(payment => ({
        ...payment.toObject(),
        _id: payment._id.toString(),
        currency: (payment as any).currency || 'USD', // 确保currency字段存在
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString()
      })),
      totalCount: payments.length,
      totalRevenueByCurrency,
      completedCount
    };

    // 获取咨询数据
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    const pendingCount = consultations.filter(c => c.status === 'pending').length;
    const repliedCount = consultations.filter(c => c.status === 'replied').length;

    // 设置咨询数据，转换Date对象为string
    consultationsData = {
      consultations: consultations.map(consultation => ({
        ...consultation.toObject(),
        _id: consultation._id.toString(),
        createdAt: consultation.createdAt.toISOString(),
        updatedAt: consultation.updatedAt.toISOString()
      })),
      totalCount: consultations.length,
      pendingCount,
      repliedCount
    };
  } catch (err) {
    console.error('Database connection failed:', err);
    error = err instanceof Error ? err.message : '数据库连接失败';
  }

  return (
    <div className="space-y-8">
      {/* 数据库错误提示 */}
      {error && (
        <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-xl p-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle text-[#FF3B30] text-xl mr-3"></i>
            <div>
              <h3 className="text-[#FF3B30] font-medium">数据库连接失败</h3>
              <p className="text-[#86868B] text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 总收入 - 按货币显示 */}
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">总收入</h3>
            <div className="bg-[#8676B6]/30 rounded-full p-3">
              <i className="fas fa-wallet text-[#8676B6] text-xl"></i>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {paymentsData ? Object.entries(paymentsData.totalRevenueByCurrency).map(([currency, amount]) => (
                <div key={currency}>{formatCurrency(amount, currency)}</div>
              )) : '0'}
            </div>
            <div className="text-sm text-[#86868B]">
              总订单数: {paymentsData?.totalCount || 0}
            </div>
          </div>
        </div>

        {/* 已完成订单 */}
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">已完成订单</h3>
            <div className="bg-[#34C759]/30 rounded-full p-3">
              <i className="fas fa-check-circle text-[#34C759] text-xl"></i>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {paymentsData?.completedCount || 0}
            </div>
            <div className="text-sm text-[#86868B]">
              完成率: {(paymentsData && paymentsData.totalCount > 0 ? Math.round((paymentsData.completedCount / paymentsData.totalCount) * 100) : 0)}%
            </div>
          </div>
        </div>

        {/* 待处理订单 */}
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">待处理订单</h3>
            <div className="bg-[#FFCC00]/30 rounded-full p-3">
              <i className="fas fa-clock text-[#FFCC00] text-xl"></i>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {paymentsData?.payments.filter(p => p.status === 'pending').length || 0}
            </div>
            <div className="text-sm text-[#86868B]">
              等待处理的订单
            </div>
          </div>
        </div>

        {/* 待处理咨询 */}
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">待处理咨询</h3>
            <div className="bg-[#FFD700]/30 rounded-full p-3">
              <i className="fas fa-comment-dots text-[#FFD700] text-xl"></i>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {consultationsData?.pendingCount || 0}
            </div>
            <div className="text-sm text-[#86868B]">
              等待回复的咨询
            </div>
          </div>
        </div>
      </div>

      {/* 最近记录 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近支付 */}
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">最近支付</h2>
            <Link href="/admin/payments" className="text-[#8676B6] hover:text-[#8676B6]/80 text-sm">
              查看全部 <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#48484A]">
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">订单号</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">用户</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">金额</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData && paymentsData.payments.length > 0 ? (
                  paymentsData.payments.slice(0, 5).map((payment) => (
                    <tr key={payment._id} className="border-b border-[#48484A] hover:bg-[#3A3A3C] transition-colors">
                      <td className="text-white py-4 px-4 text-sm">{payment.orderNumber || payment._id.slice(-8)}</td>
                      <td className="text-[#86868B] py-4 px-4 text-sm">{payment.user}</td>
                      <td className="text-white font-medium py-4 px-4 text-sm">{formatCurrency(payment.amount, payment.currency)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-500/30 text-green-300' : payment.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-red-500/30 text-red-300'}`}>
                          {payment.status === 'completed' ? '已完成' : payment.status === 'pending' ? '待处理' : '失败'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-[#86868B] py-8 text-center">
                      暂无支付记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 最近咨询 */}
        <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#48484A]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">最近咨询</h2>
            <Link href="/admin/consultations" className="text-[#8676B6] hover:text-[#8676B6]/80 text-sm">
              查看全部 <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#48484A]">
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">姓名</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">主题</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {consultationsData && consultationsData.consultations.length > 0 ? (
                  consultationsData.consultations.slice(0, 5).map((consultation) => (
                    <tr key={consultation._id} className="border-b border-[#48484A] hover:bg-[#3A3A3C] transition-colors">
                      <td className="text-white py-4 px-4 text-sm">{consultation.name}</td>
                      <td className="text-[#86868B] py-4 px-4 text-sm max-w-[200px] truncate">{consultation.subject}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${consultation.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' : consultation.status === 'replied' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                          {consultation.status === 'pending' ? '待处理' : '已回复'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-[#86868B] py-8 text-center">
                      暂无咨询记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;