export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

// 优化GET请求 - 添加缓存和字段选择
export async function GET() {
  try {
    console.log('[API] /api/public/comments - Fetching comments...');
    
    // 连接到数据库
    await connectMongoDB();

    // 优化查询：只选择需要的字段，限制数量，添加索引提示
    const comments = await Comment.find(
      { approved: true },
      {
        imageUrl: 1,
        title: 1,
        description: 1,
        pageUrl: 1,
        createdAt: 1,
        userName: 1,
        userComment: 1,
        userAvatar: 1,
        _id: 1
      }
    )
      .sort({ createdAt: -1 })
      .limit(20) // 限制返回数量
      .lean(); // 使用lean()返回纯JavaScript对象，提升性能

    console.log(`[API] /api/public/comments - Found ${comments.length} comments`);
    
    // 设置缓存头
    const response = NextResponse.json(comments, { status: 200 });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('[API] /api/public/comments - Error:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60' }
    });
  }
}

// 优化POST请求 - 快速响应
export async function POST(request: Request) {
  try {
    console.log('[API] /api/public/comments - Creating comment...');
    
    const body = await request.json();
    const { imageUrl, title, description, pageUrl, userName, userComment, userAvatar } = body;

    // 快速验证
    if (!imageUrl || !title || !description || !pageUrl || !userName || !userComment || !userAvatar) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 创建评论
    const newComment = await Comment.create({
      imageUrl,
      title,
      description,
      pageUrl,
      userName,
      userComment,
      userAvatar,
      approved: true
    });

    console.log('[API] /api/public/comments - Comment created');
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('[API] /api/public/comments - Error saving:', error);
    return NextResponse.json(
      { error: 'Failed to save comment' }, 
      { status: 500 }
    );
  }
}
