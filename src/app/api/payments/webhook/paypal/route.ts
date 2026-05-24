export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import Payment from '../../../../../models/Payment';
import connectMongoDB from '../../../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    console.log('PayPal webhook received:', body);

    // 这里应该验证 PayPal webhook 签名
    // 生产环境需要实现签名验证
    
    // 解析 PayPal 回调数据
    const eventType = body.event_type;
    const resource = body.resource;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      // 查找对应的支付记录并更新
      const orderId = resource.id;
      
      // 尝试通过平台交易ID或订单号找到支付记录
      let payment = await Payment.findOne({ platformTransactionId: orderId });
      
      if (!payment) {
        // 如果没找到，可以创建新记录或记录错误
        console.log('Payment not found for transaction:', orderId);
        return NextResponse.json({ success: true }, { status: 200 });
      }

      // 更新支付状态
      payment.status = 'completed';
      payment.platformStatus = eventType;
      payment.callbackData = body;
      payment.updatedAt = new Date();
      
      await payment.save();
      console.log('Payment updated to completed:', payment._id);
    } else if (eventType === 'PAYMENT.CAPTURE.DENIED' || eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      // 处理失败或退款
      const orderId = resource.id;
      let payment = await Payment.findOne({ platformTransactionId: orderId });
      
      if (payment) {
        payment.status = eventType === 'PAYMENT.CAPTURE.REFUNDED' ? 'refunded' : 'failed';
        payment.platformStatus = eventType;
        payment.callbackData = body;
        payment.updatedAt = new Date();
        await payment.save();
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
