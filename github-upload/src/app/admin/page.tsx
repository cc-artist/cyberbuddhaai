import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAppSession } from '../../lib/auth';
import Payment from '../../models/Payment';
import Consultation from '../../models/Consultation';
import connectMongoDB from '../../lib/mongodb';

// Sample payment data for initialization
const samplePayments = [
  { id: 'PAY20260207001', user: '张三', amount: 100, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 10:30:00') },
  { id: 'PAY20260207002', user: '李四', amount: 200, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 11:15:00') },
  { id: 'PAY20260207005', user: '孙七', amount: 250, status: 'completed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 15:10:00') },
  { id: 'PAY20260207007', user: '吴九', amount: 400, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 17:45:00') },
  { id: 'PAY20260207008', user: '郑十', amount: 120, status: 'completed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 18:20:00') },
  { id: 'PAY20260207009', user: '陈一', amount: 50, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 19:00:00') },
  { id: 'PAY20260207010', user: '林二', amount: 350, status: 'completed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 19:30:00') },
  { id: 'PAY20260207011', user: '黄三', amount: 80, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 20:00:00') },
  { id: 'PAY20260207003', user: '王五', amount: 150, status: 'pending', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 12:45:00') },
  { id: 'PAY20260207006', user: '周八', amount: 180, status: 'pending', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 16:30:00') },
  { id: 'PAY20260207012', user: '刘四', amount: 220, status: 'pending', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 20:30:00') },
  { id: 'PAY20260207013', user: '杨五', amount: 130, status: 'pending', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 21:00:00') },
  { id: 'PAY20260207004', user: '赵六', amount: 300, status: 'failed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 14:20:00') },
  { id: 'PAY20260207014', user: '朱六', amount: 90, status: 'failed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 21:30:00') },
  { id: 'PAY20260207015', user: '秦七', amount: 170, status: 'cancelled', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 22:00:00') },
  { id: 'PAY20260207016', user: '尤八', amount: 240, status: 'cancelled', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 22:30:00') },
  { id: 'PAY20260207017', user: '许九', amount: 0, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 23:00:00') }
];

// Explicitly set runtime for server components
export const runtime = 'nodejs';

// Set dynamic rendering
export const dynamic = 'force-dynamic';

// 定义API响应类型
interface Payment {
  id: string;
  user: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  paymentPlatform: 'paypal' | 'pingpong' | 'unknown';
  createdAt: string;
  updatedAt: string;
}

interface PaymentsResponse {
  payments: Payment[];
  totalCount: number;
  totalRevenue: number;
  completedCount: number;
}

// 定义咨询数据类型
interface Consultation {
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

interface ConsultationsResponse {
  consultations: Consultation[];
  totalCount: number;
  pendingCount: number;
  repliedCount: number;
}

const AdminDashboard = async () => {
  // 添加认证检查
  const session = await getAppSession();
  
  if (!session?.user) {
    redirect('/admin/login');
  }

  // 获取支付数据 - 直接在服务器端获取，不需要通过fetch请求
  let paymentsData: PaymentsResponse | null = null;
  let consultationsData: ConsultationsResponse | null = null;
  let error = null;

  try {
    // 连接到数据库
    await connectMongoDB();

    // 从数据库获取真实支付数据
    let payments = await Payment.find();

    // 如果数据库为空，初始化示例数据
    if (payments.length === 0) {
      await Payment.insertMany(samplePayments);
      payments = await Payment.find();
    }

    // 计算统计数据
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedCount = payments.filter(payment => payment.status === 'completed').length;

    // 设置支付数据，转换Date对象为string
    paymentsData = {
      payments: payments.map(payment => ({
        ...payment.toObject(),
        id: payment.id,
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt.toISOString()
      })),
      totalCount: payments.length,
      totalRevenue,
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
        id: consultation.id,
        createdAt: consultation.createdAt.toISOString(),
        updatedAt: consultation.updatedAt.toISOString()
      })),
      totalCount: consultations.length,
      pendingCount,
      repliedCount
    };
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch data';
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
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 总收入 */}
          <div className="bg-[#2C2C2E] rounded-2xl shadow-xl p-6 border border-[#48484A]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">总收入</h3>
              <div className="bg-[#8676B6]/30 rounded-full p-3">
                <i className="fas fa-wallet text-[#8676B6] text-xl"></i>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                ¥{paymentsData?.totalRevenue.toLocaleString() || '0'}
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
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">支付平台</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">状态</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">创建时间</th>
                  <th className="text-[#86868B] py-3 px-4 text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData && paymentsData.payments.length > 0 ? (
                  paymentsData.payments.slice(0, 10).map((payment) => (
                    <tr key={payment.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C] transition-colors">
                      <td className="text-white py-4 px-4">{payment.id}</td>
                      <td className="text-[#86868B] py-4 px-4">{payment.user}</td>
                      <td className="text-white font-medium py-4 px-4">¥{payment.amount}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${payment.paymentPlatform === 'paypal' ? 'bg-blue-500/30 text-blue-300' : payment.paymentPlatform === 'pingpong' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>
                          {payment.paymentPlatform === 'paypal' ? 'PayPal' : payment.paymentPlatform === 'pingpong' ? 'PingPong' : '未知平台'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-500/30 text-green-300' : payment.status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' : payment.status === 'failed' ? 'bg-red-500/30 text-red-300' : 'bg-gray-500/30 text-gray-300'}`}>
                          {payment.status === 'completed' ? '已完成' : payment.status === 'pending' ? '待处理' : payment.status === 'failed' ? '失败' : '已取消'}
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
                    <tr key={consultation.id} className="border-b border-[#48484A] hover:bg-[#3A3A3C] transition-colors">
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