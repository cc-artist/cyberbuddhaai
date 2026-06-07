export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import Payment from '../../../../models/Payment';
import connectMongoDB from '../../../../lib/mongodb';

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
    const payments = await Payment.find();

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