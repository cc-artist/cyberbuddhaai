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
    const payments = await Payment.find().sort({ createdAt: -1 });

    // 计算统计数据
    const totalRevenue = payments.reduce((sum, payment: any) => sum + payment.amount, 0);
    const completedCount = payments.filter((payment: any) => payment.status === 'completed').length;

    // 返回支付数据
    return NextResponse.json({
      payments: payments,
      totalCount: payments.length,
      totalRevenue,
      completedCount,
      isUsingFallback: false
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting payments:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 获取请求体
    const body = await request.json();
    const { id, user, amount, status, paymentPlatform } = body;

    // 验证必填字段
    if (!id || !user || !amount) {
      return NextResponse.json({ error: 'id, user and amount are required' }, { status: 400 });
    }

    // 创建新的支付记录
    const payment = await Payment.create({
      id,
      user,
      amount,
      status: status || 'pending',
      paymentPlatform: paymentPlatform || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 获取请求体
    const body = await request.json();
    const { id, status, amount, paymentPlatform } = body;

    // 验证必填字段
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // 更新支付记录
    const updateData: any = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (amount !== undefined) updateData.amount = amount;
    if (paymentPlatform !== undefined) updateData.paymentPlatform = paymentPlatform;

    const updatedPayment = await Payment.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    );

    if (!updatedPayment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment: updatedPayment }, { status: 200 });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 获取请求参数
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
    }

    // 删除支付记录
    const deletedPayment = await Payment.findOneAndDelete({ id });

    if (!deletedPayment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}