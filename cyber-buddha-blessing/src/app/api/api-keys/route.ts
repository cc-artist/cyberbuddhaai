import { NextResponse } from 'next/server';
import { getApiSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 从环境变量获取API Key（实际项目中应该从数据库获取）
    const apiKeys = [
      {
        id: 1,
        name: 'OpenAI API Key',
        type: 'openai',
        value: process.env.OPENAI_API_KEY || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    return NextResponse.json(apiKeys, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, type, value } = await request.json();
    // 这里应该保存到数据库并更新环境变量
    // 实际项目中应该使用更安全的方式管理API密钥
    return NextResponse.json({ 
      success: true, 
      apiKey: { id: Date.now(), name, type, value, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // 检查管理员是否已登录
  const session = await getApiSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, type, value } = await request.json();
    // 这里应该更新数据库和环境变量
    return NextResponse.json({ 
      success: true, 
      apiKey: { id, name, type, value, updatedAt: new Date().toISOString() } 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing API key id' }, { status: 400 });
    }
    // 这里应该从数据库删除API密钥
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}