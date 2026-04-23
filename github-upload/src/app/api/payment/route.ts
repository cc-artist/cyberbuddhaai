import { NextResponse } from 'next/server';
import { getApiSession } from '../../../lib/auth';

export async function GET() {
  try {
    // 从环境变量获取支付配置（实际项目中应该从数据库获取）
    // 注意：clientSecret不应该返回给前端，只返回clientId
    const paymentConfig = {
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || 'BAA9cxy8DYmUMqEob7eABEqPVGx86qxOdd-SK9ptm87tzEYmfPGVcUATLCNs7G3PeEtEh2WDEbXPwZ3ubA', // 使用默认clientId作为备选
        enabled: true
      },
      stripe: {
        enabled: false
      }
    };
    return NextResponse.json(paymentConfig, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment configuration' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await request.json();
    // 这里应该更新数据库和环境变量
    // 实际项目中应该使用更安全的方式管理支付配置
    return NextResponse.json({ 
      success: true, 
      config: { ...config, updatedAt: new Date().toISOString() } 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment configuration' }, { status: 500 });
  }
}