import { NextResponse } from 'next/server';
import Consultation from '../../../models/Consultation';
import connectMongoDB from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    // 连接到数据库
    await connectMongoDB();

    // 获取请求体数据
    const { name, email, subject, message, templeName } = await request.json();

    // 验证必填字段
    if (!name || !email || !subject || !message || !templeName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 创建新的咨询记录
    const consultation = await Consultation.create({
      name,
      email,
      subject,
      message,
      templeName,
      status: 'pending'
    });

    // 返回成功响应
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        consultation 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving consultation:', error);
    return NextResponse.json(
      { error: 'Failed to save consultation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 连接到数据库
    await connectMongoDB();

    // 获取所有咨询记录
    const consultations = await Consultation.find().sort({ createdAt: -1 });

    // 返回咨询记录
    return NextResponse.json(
      { 
        consultations,
        totalCount: consultations.length,
        pendingCount: consultations.filter(c => c.status === 'pending').length,
        repliedCount: consultations.filter(c => c.status === 'replied').length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting consultations:', error);
    return NextResponse.json(
      { error: 'Failed to get consultations' },
      { status: 500 }
    );
  }
}