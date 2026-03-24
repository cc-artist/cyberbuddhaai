import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import Payment from '../../../../models/Payment';
import connectMongoDB from '../../../../lib/mongodb';

// 示例支付数据
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

export async function GET() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 从数据库获取真实支付数据
    let payments = await Payment.find();

    // 如果数据库为空，初始化示例数据
    if (payments.length === 0) {
      await Payment.insertMany(samplePayments);
      payments = await Payment.find();
      console.log('示例数据初始化成功');
    }

    // 计算统计数据
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedCount = payments.filter(payment => payment.status === 'completed').length;

    // 返回支付数据
    return NextResponse.json({
      payments: payments,
      totalCount: payments.length,
      totalRevenue,
      completedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}