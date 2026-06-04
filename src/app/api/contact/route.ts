export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Consultation from '../../../models/Consultation';
import connectMongoDB from '../../../lib/mongodb';

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