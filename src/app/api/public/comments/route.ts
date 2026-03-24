import { NextResponse } from 'next/server';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

export async function GET() {
  try {
    // 连接到数据库
    await connectMongoDB();

    // 从数据库获取已批准的评论
    const comments = await Comment.find({ approved: true }).sort({ createdAt: -1 });

    // 返回评论数据
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 连接到数据库
    await connectMongoDB();

    // 获取请求体
    const body = await request.json();
    const { imageUrl, title, description, pageUrl, userName, userComment, userAvatar } = body;

    // 验证必填字段
    if (!imageUrl || !title || !description || !pageUrl || !userName || !userComment || !userAvatar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error saving comment:', error);
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}