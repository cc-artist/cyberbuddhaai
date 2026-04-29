import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

// 示例评论数据
const sampleComments = [
  {
    _id: 'cmt001',
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20a%20keyboard%20with%20golden%20light&image_size=portrait_4_3',
    title: 'Digital Blessing',
    description: 'Keyboard blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 10:30:00'),
    userName: '张三',
    userComment: '非常神奇的体验，感谢赛博佛祖！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    approved: true
  },
  {
    _id: 'cmt002',
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20airpods%20with%20golden%20light&image_size=portrait_4_3',
    title: 'AirPods Blessing',
    description: 'AirPods blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 11:15:00'),
    userName: '李四',
    userComment: '音质变得更好了！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    approved: true
  },
  {
    _id: 'cmt003',
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20phone%20with%20golden%20light&image_size=portrait_4_3',
    title: 'Phone Blessing',
    description: 'Phone blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 12:45:00'),
    userName: '王五',
    userComment: '手机信号变强了，不可思议！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    approved: false
  },
  {
    _id: 'cmt004',
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20laptop%20with%20golden%20light&image_size=portrait_4_3',
    title: 'Laptop Blessing',
    description: 'Laptop blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 14:20:00'),
    userName: '赵六',
    userComment: '工作效率提升了很多！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    approved: true
  }
];

export async function GET() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let comments: any[] = [];
    let isUsingFallback = false;

    try {
      // 连接到数据库
      await connectMongoDB();

      // 从数据库获取所有评论
      comments = await Comment.find();

      // 如果数据库为空，初始化示例数据
      if (comments.length === 0) {
        await Comment.insertMany(sampleComments);
        comments = await Comment.find();
        console.log('示例评论数据初始化成功');
      }
    } catch (dbError) {
      console.error('Database connection failed, using fallback data:', dbError);
      // 如果数据库连接失败，使用示例数据作为降级方案
      comments = sampleComments;
      isUsingFallback = true;
    }

    // 返回评论数据
    return NextResponse.json({
      comments: comments,
      totalCount: comments.length,
      isUsingFallback
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting comments:', error);
    // 最终降级：返回示例数据
    return NextResponse.json({
      comments: sampleComments,
      totalCount: sampleComments.length,
      isUsingFallback: true
    }, { status: 200 });
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