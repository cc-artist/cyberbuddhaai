export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

export async function GET() {
  try {
    console.log('[Comments API] GET request received');
    
    // 连接到数据库
    await connectMongoDB();
    console.log('[Comments API] Database connected');

    // 从数据库获取已批准的评论
    const comments = await Comment.find({ approved: true }).sort({ createdAt: -1 });
    console.log('[Comments API] Found', comments.length, 'comments');

    // 返回评论数据
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('[Comments API] Error getting comments:', error);
    // 返回空数组，如果数据库连接失败
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('[Comments API] POST request received');
    
    // 获取请求体
    const body = await request.json();
    console.log('[Comments API] Request body:', { ...body, imageUrl: body.imageUrl ? '[present]' : '[missing]' });
    
    const { imageUrl, title, description, pageUrl, userName, userComment, userAvatar } = body;

    // 验证必填字段
    if (!imageUrl || !title || !description || !pageUrl || !userName || !userComment || !userAvatar) {
      console.log('[Comments API] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 连接到数据库
    await connectMongoDB();
    console.log('[Comments API] Database connected for POST');

    // 创建新评论
    const newComment = await Comment.create({
      imageUrl,
      title,
      description,
      pageUrl,
      userName,
      userComment,
      userAvatar,
      approved: true // 默认批准评论
    });

    console.log('[Comments API] Comment created successfully:', newComment._id);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('[Comments API] Error saving comment:', error);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}
