export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import connectMongoDB from '../../../../lib/mongodb';
import Payment from '../../../../models/Payment';
import Consultation from '../../../../models/Consultation';
import Comment from '../../../../models/Comment';

// 示例支付数据
const samplePayments = [
  { id: 'PAY20260207001', user: '张三', userEmail: 'zhangsan@example.com', amount: 100, currency: 'USD', status: 'completed', paymentPlatform: 'paypal', templeName: '灵隐寺', createdAt: new Date('2026-02-07 10:30:00') },
  { id: 'PAY20260207002', user: '李四', userEmail: 'lisi@example.com', amount: 200, currency: 'USD', status: 'completed', paymentPlatform: 'paypal', templeName: '少林寺', createdAt: new Date('2026-02-07 11:15:00') },
  { id: 'PAY20260207005', user: '孙七', userEmail: 'sunqi@example.com', amount: 250, currency: 'USD', status: 'completed', paymentPlatform: 'pingpong', templeName: '白马寺', createdAt: new Date('2026-02-07 15:10:00') },
];

// 示例咨询数据
const sampleConsultations = [
  { name: '张三', email: 'zhangsan@example.com', subject: '关于数字加持的疑问', message: '请问数字加持的效果能持续多久？', templeName: '赛博佛祖殿', status: 'pending', createdAt: new Date('2026-02-07 10:00:00') },
  { name: '李四', email: 'lisi@example.com', subject: 'API集成问题', message: '我想将你们的API集成到我的应用中，需要什么权限？', templeName: '赛博佛祖殿', status: 'pending', createdAt: new Date('2026-02-07 11:30:00') },
];

// 示例评论数据
const sampleComments = [
  {
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text-to-image?prompt=cyber%20buddha%20blessing%20a%20keyboard%20with%20golden%20light&image-size=portrait-4-3',
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
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text-to-image?prompt=cyber%20buddha%20blessing%20airpods%20with%20golden%20light&image-size=portrait-4-3',
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
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text-to-image?prompt=cyber%20buddha%20blessing%20phone%20with%20golden%20light&image-size=portrait-4-3',
    title: 'Phone Blessing',
    description: 'Phone blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 12:45:00'),
    userName: '王五',
    userComment: '手机信号变强了，不可思议！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    approved: true
  },
];

export async function POST() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();
    console.log('Database connected successfully for initialization');

    const results: any = {};

    // 检查并初始化Payment集合
    const paymentCount = await Payment.countDocuments();
    if (paymentCount === 0) {
      await Payment.insertMany(samplePayments);
      results.payments = `Initialized ${samplePayments.length} payment records`;
      console.log(results.payments);
    } else {
      results.payments = `Payment collection already has ${paymentCount} records`;
      console.log(results.payments);
    }

    // 检查并初始化Consultation集合
    const consultationCount = await Consultation.countDocuments();
    if (consultationCount === 0) {
      await Consultation.insertMany(sampleConsultations);
      results.consultations = `Initialized ${sampleConsultations.length} consultation records`;
      console.log(results.consultations);
    } else {
      results.consultations = `Consultation collection already has ${consultationCount} records`;
      console.log(results.consultations);
    }

    // 检查并初始化Comment集合
    const commentCount = await Comment.countDocuments();
    if (commentCount === 0) {
      await Comment.insertMany(sampleComments);
      results.comments = `Initialized ${sampleComments.length} comment records`;
      console.log(results.comments);
    } else {
      results.comments = `Comment collection already has ${commentCount} records`;
      console.log(results.comments);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully',
      results 
    }, { status: 200 });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
