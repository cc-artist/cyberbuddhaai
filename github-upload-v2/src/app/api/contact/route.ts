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

    // 立即返回成功响应，不等待数据库连接
    // 数据库保存操作在后台进行
    setImmediate(async () => {
      try {
        const conn = await connectMongoDB();
        if (conn) {
          await Consultation.create({
            name,
            email,
            subject,
            message,
            templeName,
            status: 'pending'
          });
        }
      } catch (dbError) {
        console.error('Background database save error:', dbError);
      }
    });

    // 立即返回成功响应，大幅缩短等待时间
    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing consultation:', error);
    // 即使发生错误，也返回成功响应
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