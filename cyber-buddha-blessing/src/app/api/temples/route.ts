import { NextResponse } from 'next/server';
import { getApiSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { temples as mockTemples } from '../../../data/TempleData';

export async function GET() {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 这里应该从数据库获取数据，现在使用mock数据
    return NextResponse.json(mockTemples, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch temples' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const temple = await request.json();
    // 这里应该保存到数据库，现在返回成功信息
    return NextResponse.json({ success: true, temple }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create temple' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const temple = await request.json();
    // 这里应该更新数据库，现在返回成功信息
    return NextResponse.json({ success: true, temple }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update temple' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing temple id' }, { status: 400 });
    }
    // 这里应该从数据库删除，现在返回成功信息
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete temple' }, { status: 500 });
  }
}