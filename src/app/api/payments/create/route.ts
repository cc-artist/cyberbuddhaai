export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import Payment from '../../../../models/Payment';
import connectMongoDB from '../../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const {
      user,
      userEmail,
      amount,
      currency = 'USD',
      paymentPlatform,
      serviceType,
      templeName
    } = body;

    // 生成订单号
    const orderNumber = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 创建支付记录
    const payment = new Payment({
      orderNumber,
      user: user || 'Guest',
      userEmail,
      amount: parseFloat(amount),
      currency,
      status: 'pending',
      paymentPlatform: paymentPlatform || 'unknown',
      serviceType,
      templeName,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await payment.save();

    console.log('Payment created:', orderNumber);

    return NextResponse.json({
      success: true,
      paymentId: payment._id,
      orderNumber
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
