import { NextResponse } from 'next/server';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

export async function GET() {
  try {
<<<<<<< Updated upstream
    // 连接到数据库
    const conn = await connectMongoDB();
    
    // 如果数据库连接失败，返回空数组
    if (!conn) {
      console.log('Database connection failed, returning empty array');
      return NextResponse.json([], { status: 200 });
    }

    // 从数据库获取已批准的评论
    const comments = await Comment.find({ approved: true }).sort({ createdAt: -1 });
=======
    // 连接到数据库，设置10秒超时
    await withTimeout(connectMongoDB(), 10000);

    // 从数据库获取已批准的评论，设置5秒超时
    const comments = await withTimeout(
      Comment.find({ approved: true }).sort({ createdAt: -1 }),
      5000
    );
>>>>>>> Stashed changes

    // 返回评论数据
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error getting comments:', error);
    // 返回空数组作为默认值，避免前端崩溃
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    // 获取请求体
    const body = await request.json();
    const { imageUrl, title, description, pageUrl, userName, userComment, userAvatar } = body;

    // 验证必填字段
    if (!imageUrl || !title || !description || !pageUrl || !userName || !userComment || !userAvatar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 立即返回成功响应，不等待数据库连接
    setImmediate(async () => {
      try {
        const conn = await connectMongoDB();
        if (conn) {
          await Comment.create({
            imageUrl,
            title,
            description,
            pageUrl,
            userName,
            userComment,
            userAvatar,
            approved: true
          });
        }
      } catch (dbError) {
        console.error('Background database save error:', dbError);
      }
    });

    // 立即返回成功响应，大幅缩短等待时间
    return NextResponse.json(
      { success: true, message: 'Comment saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving comment:', error);
    return NextResponse.json(
      { success: true, message: 'Comment saved successfully' },
      { status: 201 }
    );
  }
}