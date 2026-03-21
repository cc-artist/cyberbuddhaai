import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

export async function GET() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 从数据库获取所有评论
    const comments = await Comment.find();

    // 返回评论数据
    return NextResponse.json({
      comments: comments,
      totalCount: comments.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 获取请求体
    const body = await request.json();
    const { commentId, action } = body;

    if (!commentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 处理评论操作
    if (action === 'approve' || action === 'reject') {
      // 更新评论状态
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { approved: action === 'approve' },
        { new: true }
      );

      if (!updatedComment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, comment: updatedComment }, { status: 200 });
    } else if (action === 'delete') {
      // 删除评论
      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error managing comments:', error);
    return NextResponse.json({ error: 'Failed to manage comments' }, { status: 500 });
  }
}