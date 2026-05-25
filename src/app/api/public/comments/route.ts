export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

export async function GET() {
  try {
    console.log('[API] /api/public/comments - Fetching comments from database...');
    // 连接到数据库
    await connectMongoDB();

    // 从数据库获取已批准的评论
    const comments = await Comment.find({ approved: true }).sort({ createdAt: -1 });

    console.log(`[API] /api/public/comments - Found ${comments.length} comments in database`);
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('[API] /api/public/comments - Error getting comments:', error);
    // 返回空数组，不使用模拟数据
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('[API] /api/public/comments - Creating new comment...');
    // 连接到数据库
    await connectMongoDB();

    // 获取请求体
    const body = await request.json();
    const { imageUrl, title, description, pageUrl, userName, userComment, userAvatar } = body;

    // 验证必填字段
    if (!imageUrl || !title || !description || !pageUrl || !userName || !userComment || !userAvatar) {
      console.warn('[API] /api/public/comments - Missing required fields');
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

    console.log('[API] /api/public/comments - Comment created successfully');
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('[API] /api/public/comments - Error saving comment:', error);
    // 返回友好的错误信息
    return NextResponse.json({ error: 'Failed to save comment. Please try again later.' }, { status: 500 });
  }
}
