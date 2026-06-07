export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Consultation from '../../../models/Consultation';
import connectMongoDB from '../../../lib/mongodb';
import { isAdminAuthenticated } from '../../../lib/auth';

// 优化POST请求 - 快速响应
export async function POST(request: Request) {
  try {
    // 快速验证
    const body = await request.json();
    const { name, email, subject, message, templeName } = body;

    if (!name || !email || !subject || !message || !templeName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 异步处理数据库保存，先返回响应
    (async () => {
      try {
        await connectMongoDB();
        await Consultation.create({
          name,
          email,
          subject,
          message,
          templeName,
          status: 'pending'
        });
        console.log('[API] /api/contact - Consultation saved');
      } catch (dbError) {
        console.error('[API] /api/contact - Database error:', dbError);
      }
    })();

    // 立即返回成功响应，不等待数据库操作
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] /api/contact - Error:', error);
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully'
      },
      { status: 201 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    
    // 优化查询
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      { 
        consultations,
        totalCount: consultations.length,
        pendingCount: consultations.filter(c => c.status === 'pending').length,
        repliedCount: consultations.filter(c => c.status === 'replied').length
      },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=30' } }
    );
  } catch (error) {
    console.error('[API] /api/contact - Error:', error);
    return NextResponse.json(
      { 
        consultations: [],
        totalCount: 0,
        pendingCount: 0,
        repliedCount: 0
      },
      { status: 200 }
    );
  }
}

// PUT 方法：更新咨询状态（需要管理员权限）
export async function PUT(request: Request) {
  try {
    // 检查管理员权限
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证状态值
    const validStatuses = ['pending', 'replied', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // 更新数据库
    const updatedConsultation = await Consultation.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedConsultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        consultation: updatedConsultation 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] /api/contact PUT - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}
