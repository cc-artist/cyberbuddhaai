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

    // 计算按货币分类的总收入
    const totalRevenueByCurrency: Record<string, number> = {};
    payments.forEach(payment => {
      const currency = (payment as any).currency || 'USD';
      if (!totalRevenueByCurrency[currency]) {
        totalRevenueByCurrency[currency] = 0;
      }
      if (payment.status === 'completed') {
        totalRevenueByCurrency[currency] += payment.amount;
      }
    });
    const completedCount = payments.filter(payment => payment.status === 'completed').length;

    // 转换数据，确保日期是字符串格式，并且包含所有必要字段
    const formattedPayments = payments.map(payment => ({
      ...payment.toObject(),
      _id: payment._id.toString(),
      currency: (payment as any).currency || 'USD',
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString()
    }));

    // 返回支付数据
    return NextResponse.json({
      payments: formattedPayments,
      totalCount: payments.length,
      totalRevenueByCurrency,
      completedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}