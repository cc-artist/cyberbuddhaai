export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import Payment from '../../../../models/Payment';
import Consultation from '../../../../models/Consultation';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

export async function POST() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 清空所有数据
    const paymentDeleteResult = await Payment.deleteMany({});
    const consultationDeleteResult = await Consultation.deleteMany({});
    const commentDeleteResult = await Comment.deleteMany({});

    return NextResponse.json({
      success: true,
      message: '所有数据已清空',
      deleted: {
        payments: paymentDeleteResult.deletedCount,
        consultations: consultationDeleteResult.deletedCount,
        comments: commentDeleteResult.deletedCount
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 });
  }
}
