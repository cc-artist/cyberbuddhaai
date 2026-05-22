import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAppSession } from '../../lib/auth';
import Payment from '../../models/Payment';
import Consultation from '../../models/Consultation';
import connectMongoDB from '../../lib/mongodb';

// Explicitly set runtime for server components
export const runtime = 'nodejs';

// Set dynamic rendering
export const dynamic = 'force-dynamic';

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
  orderNumber?: string;
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

// 模拟支付数据
const mockPayments = [
  {
    _id: 'mock1',
    orderNumber: 'ORD001',
    user: '张三',
    userEmail: 'zhangsan@example.com',
    amount: 100,
    currency: 'USD',
    status: 'completed' as const,
    paymentPlatform: 'paypal' as const,
    templeName: '灵隐寺',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock2',
    orderNumber: 'ORD002',
    user: '李四',
    userEmail: 'lisi@example.com',
    amount: 200,
    currency: 'USD',
    status: 'completed' as const,
    paymentPlatform: 'pingpong' as const,
    templeName: '少林寺',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// 模拟咨询数据
const mockConsultations = [
  {
    _id: 'mock1',
    name: '张三',
    email: 'zhangsan@example.com',
    subject: '关于数字加持的疑问',
    message: '请问数字加持的效果能持续多久？',
    templeName: '赛博佛祖殿',
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const AdminDashboard = async () => {
  // 认证检查
  const session = await getAppSession();
  
  if (!session?.user) {
    redirect('/admin/login');
  }

  // 获取支付数据 - 只使用真实数据库
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
      if (!totalRevenueByCurrency[payment.currency]) {
        totalRevenueByCurrency[payment.currency] = 0;
      }
      if (payment.status === 'completed') {
        totalRevenueByCurrency[payment.currency] += payment.amount;
      }
    });
    const completedCount = payments.filter(payment => payment.status === 'completed').length;

    // 设置支付数据，转换Date对象为string
    paymentsData = {
      payments: payments.map(payment => ({
        ...payment.toObject(),
        _id: payment._id.toString(),
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
    console.error('Database connection error:', err);
    error = err instanceof Error ? err.message : 'Failed to connect to database';
    // 如果数据库连接失败，显示空数据而不是模拟数据
    paymentsData = {
      payments: [],
      totalCount: 0,
      totalRevenueByCurrency: {},
      completedCount: 0
    };
    consultationsData = {
      consultations: [],
      totalCount: 0,
      pendingCount: 0,
      repliedCount: 0
    };
  }

  return (
    <div className="min-h-screen bg-[#1D1D1F] text-[#F5F5F7]">
      {/* 导航栏 */}
      <header className="bg-[#2C2C2E] border-b border-[#48484A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">赛博佛祖管理后台</h1>
            <span className="ml-3 text-sm text-[#86868B]">Production Environment</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#86868B]">
              <i className="fas fa-user-circle mr-2"></i>
              {session.user.email || '管理员'}
            </span>
            <Link
              href="/api/auth/signout"
              className="bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> 退出登录
            </Link>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 数据库错误提示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
              <div>
                <h3 className="text-red-400 font-medium">数据库连接失败</h3>
                <p className="text-[#86868B] text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 总收入 - 按货币显示 */}
          <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
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
          <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
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
          <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
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

          {/* 失败订单 */}
          <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">失败订单</h3>
              <div className="bg-[#FF3B30]/30 rounded-full p-3">
                <i className="fas fa-times-circle text-[#FF3B30] text-xl"></i>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {paymentsData?.payments.filter(p => p.status === 'failed').length || 0}
              </div>
              <div className="text-sm text-[#86868B]">
                支付失败的订单
              </div>
            </div>
          </div>
          
          {/* 待处理咨询 */}
          <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
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

        {/* 支付管理部分 */}
        <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">支付管理</h2>
            <div className="bg-[#8676B6]/30 rounded-full p-2">
              <i className="fas fa-credit-card text-[#8676B6] text-xl"></i>
            </div>
          </div>

          {/* 支付表格 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#48484A]">
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">订单号</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">用户</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">金额</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">货币</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">支付平台</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">寺庙</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">状态</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">创建时间</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData && paymentsData.payments.length > 0 ? (
                  paymentsData.payments.slice(0, 10).map((payment) => (
                    <tr key={payment._id} className="border-b border-[#48484A] hover:bg-[#3A3A3C] transition-colors">
                      <td className="text-white py-4 px-4">{payment.orderNumber || payment._id.slice(-8)}</td>
                      <td className="text-[#86868B] py-4 px-4">
                        <div>{payment.user}</div>
                        {payment.userEmail && <div className="text-xs opacity-70">{payment.userEmail}</div>}
                      </td>
                      <td className="text-white font-medium py-4 px-4">{formatCurrency(payment.amount, payment.currency)}</td>
                      <td className="text-[#86868B] py-4 px-4">{payment.currency}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${payment.paymentPlatform === 'paypal' ? 'bg-blue-500/30 text-blue-300' : payment.paymentPlatform === 'pingpong' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                          {payment.paymentPlatform === 'paypal' ? 'PayPal' : payment.paymentPlatform === 'pingpong' ? 'PingPong' : '未知平台'}
                        </span>
                      </td>
                      <td className="text-[#86868B] py-4 px-4">{payment.templeName || '-'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-500/30 text-green-300' : payment.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' : payment.status === 'failed' ? 'bg-red-500/30 text-red-300' : 'bg-gray-500/30 text-gray-300'}`}>
                          {payment.status === 'completed' ? '已完成' : payment.status === 'pending' ? '待处理' : payment.status === 'failed' ? '失败' : payment.status === 'refunded' ? '已退款' : '已取消'}
                        </span>
                      </td>
                      <td className="text-[#86868B] py-4 px-4 text-sm">{new Date(payment.createdAt).toLocaleString('zh-CN')}</td>
                      <td className="py-4 px-4">
                        <button className="text-[#86868B] hover:text-white text-sm mr-3">
                          <i className="fas fa-eye mr-1"></i> 查看
                        </button>
                        <button className="text-[#86868B] hover:text-white text-sm">
                          <i className="fas fa-edit mr-1"></i> 编辑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-[#86868B] py-8 text-center">
                      {error ? (
                        <div>
                          <i className="fas fa-exclamation-circle text-4xl mb-2 text-[#FF3B30]"></i>
                          <p className="mb-1">获取数据失败</p>
                          <p className="text-sm opacity-70">{error}</p>
                        </div>
                      ) : (
                        <div>
                          <i className="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                          <p>暂无支付记录</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 咨询管理部分 */}
        <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">用户咨询管理</h2>
            <div className="bg-[#8676B6]/30 rounded-full p-2">
              <i className="fas fa-comments text-[#8676B6] text-xl"></i>
            </div>
          </div>

          {/* 咨询表格 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#48484A]">
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">姓名</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">邮箱</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">主题</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">寺庙</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">状态</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">创建时间</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {consultationsData && consultationsData.consultations.length > 0 ? (
                  consultationsData.consultations.slice(0, 10).map((consultation) => (
                    <tr key={consultation._id} className="border-b border-[#48484A] hover:bg-[#3A3A3C] transition-colors">
                      <td className="text-white py-4 px-4">{consultation.name}</td>
                      <td className="text-[#86868B] py-4 px-4">{consultation.email}</td>
                      <td className="text-[#86868B] py-4 px-4 text-sm max-w-[200px] truncate">{consultation.subject}</td>
                      <td className="text-[#86868B] py-4 px-4">{consultation.templeName}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${consultation.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' : consultation.status === 'replied' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                          {consultation.status === 'pending' ? '待处理' : consultation.status === 'replied' ? '已回复' : '已关闭'}
                        </span>
                      </td>
                      <td className="text-[#86868B] py-4 px-4 text-sm">{new Date(consultation.createdAt).toLocaleString('zh-CN')}</td>
                      <td className="py-4 px-4">
                        <button className="text-[#86868B] hover:text-white text-sm mr-3">
                          <i className="fas fa-eye mr-1"></i> 查看
                        </button>
                        <button className="text-[#86868B] hover:text-white text-sm">
                          <i className="fas fa-edit mr-1"></i> 编辑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-[#86868B] py-8 text-center">
                      {error ? (
                        <div>
                          <i className="fas fa-exclamation-circle text-4xl mb-2 text-[#FF3B30]"></i>
                          <p className="mb-1">获取数据失败</p>
                          <p className="text-sm opacity-70">{error}</p>
                        </div>
                      ) : (
                        <div>
                          <i className="fas fa-inbox text-4xl mb-2 opacity-50"></i>
                          <p>暂无咨询记录</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* API信息 */}
        <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
          <h2 className="text-xl font-semibold text-white mb-4">API信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1D1D1F]/50 rounded-xl p-4">
              <h3 className="text-[#86868B] text-sm mb-1">支付API</h3>
              <p className="text-white font-mono text-sm">/api/admin/payments</p>
            </div>
            <div className="bg-[#1D1D1F]/50 rounded-xl p-4">
              <h3 className="text-[#86868B] text-sm mb-1">状态</h3>
              <p className="text-white">{paymentsData ? '正常' : '异常'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-12 text-center text-[#86868B] text-sm py-6 border-t border-[#48484A]">
        <p>&copy; 2026 赛博佛祖在线加持服务 | Cyber Buddha Online Blessing Service</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;