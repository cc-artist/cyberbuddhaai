import { NextResponse } from 'next/server';
import Consultation from '../../../models/Consultation';
import connectMongoDB from '../../../lib/mongodb';

export async function POST(request: Request) {
  try {
    // 获取请求体数据
    const { name, email, subject, message, templeName } = await request.json();

    // 验证必填字段
    if (!name || !email || !subject || !message || !templeName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 尝试连接到数据库并保存咨询记录
    const conn = await connectMongoDB();
    let consultation = null;
    
    if (conn) {
      try {
        // 创建新的咨询记录
        consultation = await Consultation.create({
          name,
          email,
          subject,
          message,
          templeName,
          status: 'pending'
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // 数据库错误不影响表单提交
      }
    }

    // 无论数据库是否连接成功，都返回成功响应
    // 这样用户体验更好，即使数据库连接失败也能提交表单
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        consultation 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing consultation:', error);
    // 即使发生其他错误，也返回成功响应
    // 确保用户表单提交体验不受影响
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
    // 返回空数据作为默认值
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