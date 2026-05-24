export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import Comment from '../../../../models/Comment';
import connectMongoDB from '../../../../lib/mongodb';

// 辅助函数：带超时的数据库操作
async function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Database operation timeout')), timeout);
  });
  return Promise.race([promise, timeoutPromise]) as Promise<T>;
}

// 默认评论数据
const defaultComments = [
  {
    id: 'default-1',
    imageUrl: '/temple-images/灵隐寺.webp',
    title: 'My First Blessing',
    description: 'Received my digital blessing today!',
    pageUrl: 'https://cyber-buddha.blessing',
    createdAt: new Date(),
    userName: 'Cyber Monk',
    userComment: 'May peace and wisdom fill your heart',
    userAvatar: 'https://ui-avatars.com/api/?name=Monk&background=random',
    approved: true
  },
  {
    id: 'default-2',
    imageUrl: '/temple-images/南华寺.webp',
    title: 'Digital Enlightenment',
    description: 'The cyber blessing experience was amazing!',
    pageUrl: 'https://cyber-buddha.blessing',
    createdAt: new Date(Date.now() - 86400000),
    userName: 'Tech Seeker',
    userComment: 'A perfect blend of technology and spirituality',
    userAvatar: 'https://ui-avatars.com/api/?name=Tech&background=random',
    approved: true
  },
  {
    id: 'default-3',
    imageUrl: '/temple-images/少林寺.webp',
    title: 'Blessed Device',
    description: 'My phone now has a spiritual aura',
    pageUrl: 'https://cyber-buddha.blessing',
    createdAt: new Date(Date.now() - 172800000),
    userName: 'Digital Pilgrim',
    userComment: 'Every time I use my device, I feel blessed',
    userAvatar: 'https://ui-avatars.com/api/?name=Pilgrim&background=random',
    approved: true
  },
  {
    id: 'default-4',
    imageUrl: '/temple-images/寒山寺.webp',
    title: 'Cyber Blessing',
    description: 'A unique spiritual experience in the digital age',
    pageUrl: 'https://cyber-buddha.blessing',
    createdAt: new Date(Date.now() - 259200000),
    userName: 'Spiritual Coder',
    userComment: 'Technology meets transcendence',
    userAvatar: 'https://ui-avatars.com/api/?name=Coder&background=random',
    approved: true
  },
  {
    id: 'default-5',
    imageUrl: '/temple-images/灵山大佛.jpg',
    title: 'Enlightened Technology',
    description: 'My laptop now radiates positive energy',
    pageUrl: 'https://cyber-buddha.blessing',
    createdAt: new Date(Date.now() - 345600000),
    userName: 'Zen Developer',
    userComment: 'Work with purpose and peace',
    userAvatar: 'https://ui-avatars.com/api/?name=Zen&background=random',
    approved: true
  }
];

export async function GET() {
  try {
    // 连接到数据库，设置3秒超时
    await withTimeout(connectMongoDB(), 3000);

    // 从数据库获取已批准的评论，设置2秒超时
    const comments = await withTimeout(
      Comment.find({ approved: true }).sort({ createdAt: -1 }),
      2000
    );

    // 返回评论数据
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error getting comments:', error);
    // 返回默认评论，而不是错误
    return NextResponse.json(defaultComments, { status: 200 });
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

    // 连接到数据库，设置3秒超时
    await withTimeout(connectMongoDB(), 3000);

    // 创建新评论，设置2秒超时
    const newComment = await withTimeout(
      Comment.create({
        imageUrl,
        title,
        description,
        pageUrl,
        userName,
        userComment,
        userAvatar,
        approved: true // 默认批准评论
      }),
      2000
    );

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error saving comment:', error);
    // 快速返回错误，不阻塞请求
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
  }
}