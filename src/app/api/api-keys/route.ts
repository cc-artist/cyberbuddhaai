import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../lib/auth';

// 模拟存储的API密钥（实际项目中应该从数据库获取）
let apiKeys: any[] = [
  {
    id: 1,
    name: 'OpenAI API Key',
    type: 'openai',
    value: process.env.OPENAI_API_KEY ? 'sk-********************' : '未配置',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 2,
    name: 'PayPal API Key',
    type: 'paypal',
    value: process.env.PAYPAL_API_KEY ? '********************' : '未配置',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString()
  },
  {
    id: 3,
    name: 'PingPong API Key',
    type: 'pingpong',
    value: process.env.PINGPONG_API_KEY ? '********************' : '未配置',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString()
  }
];

export async function GET() {
  try {
    // 检查管理员是否已认证（使用统一的认证函数）
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查API密钥状态
    const apiStatus = {
      openai: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10,
      paypal: !!process.env.PAYPAL_API_KEY && process.env.PAYPAL_API_KEY.length > 10,
      pingpong: !!process.env.PINGPONG_API_KEY && process.env.PINGPONG_API_KEY.length > 10
    };

    const keysWithStatus = apiKeys.map(key => ({
      ...key,
      status: apiStatus[key.type] ? 'active' : 'inactive',
      lastChecked: new Date().toISOString()
    }));

    return NextResponse.json(keysWithStatus, { status: 200 });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type, value } = await request.json();
    
    if (!name || !type || !value) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 创建新的API密钥
    const newKey = {
      id: Date.now(),
      name,
      type,
      value: value.slice(0, 4) + '********************', // 隐藏部分密钥
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: value.length > 10 ? 'active' : 'inactive'
    };

    apiKeys.push(newKey);
    return NextResponse.json({ success: true, apiKey: newKey }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, type, value } = await request.json();
    
    if (!id || !name || !value) {
      return NextResponse.json({ error: 'id, name and value are required' }, { status: 400 });
    }

    // 更新API密钥
    const index = apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    apiKeys[index] = {
      ...apiKeys[index],
      name,
      type,
      value: value.slice(0, 4) + '********************',
      updatedAt: new Date().toISOString(),
      status: value.length > 10 ? 'active' : 'inactive'
    };

    return NextResponse.json({ success: true, apiKey: apiKeys[index] }, { status: 200 });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing API key id' }, { status: 400 });
    }

    // 删除API密钥
    const index = apiKeys.findIndex(k => k.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    const deletedKey = apiKeys.splice(index, 1)[0];
    return NextResponse.json({ success: true, id: deletedKey.id }, { status: 200 });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}