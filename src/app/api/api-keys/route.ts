import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../lib/auth';
import APIKey from '../../../models/APIKey';
import connectMongoDB from '../../../lib/mongodb';

export async function GET() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 连接到数据库
    await connectMongoDB();

    // 检查API密钥状态（从环境变量）
    const apiStatus = {
      openai: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10,
      paypal: !!process.env.PAYPAL_API_KEY && process.env.PAYPAL_API_KEY.length > 10,
      pingpong: !!process.env.PINGPONG_API_KEY && process.env.PINGPONG_API_KEY.length > 10
    };

    // 从数据库获取API密钥
    let apiKeys = await APIKey.find();

    // 如果数据库为空，初始化默认密钥记录
    if (apiKeys.length === 0) {
      const defaultKeys = [
        {
          name: 'OpenAI API Key',
          type: 'openai',
          value: process.env.OPENAI_API_KEY ? 'sk-********************' : '未配置',
          status: apiStatus.openai ? 'active' : 'inactive',
          lastChecked: new Date()
        },
        {
          name: 'PayPal API Key',
          type: 'paypal',
          value: process.env.PAYPAL_API_KEY ? '********************' : '未配置',
          status: apiStatus.paypal ? 'active' : 'inactive',
          lastChecked: new Date()
        },
        {
          name: 'PingPong API Key',
          type: 'pingpong',
          value: process.env.PINGPONG_API_KEY ? '********************' : '未配置',
          status: apiStatus.pingpong ? 'active' : 'inactive',
          lastChecked: new Date()
        }
      ];
      await APIKey.insertMany(defaultKeys);
      apiKeys = await APIKey.find();
      console.log('API keys initialized');
    }

    // 更新状态并返回
    const keysWithStatus = apiKeys.map(key => ({
      ...key.toObject(),
      status: (apiStatus as Record<string, boolean>)[key.type as string] ? 'active' : 'inactive',
      lastChecked: new Date()
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

    // 连接到数据库
    await connectMongoDB();

    const { name, type, value } = await request.json();
    
    if (!name || !type || !value) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 创建新的API密钥
    const newKey = await APIKey.create({
      name,
      type,
      value: value.slice(0, 4) + '********************', // 隐藏部分密钥
      status: value.length > 10 ? 'active' : 'inactive',
      lastChecked: new Date()
    });

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

    // 连接到数据库
    await connectMongoDB();

    const { id, name, type, value } = await request.json();
    
    if (!id || !name || !value) {
      return NextResponse.json({ error: 'id, name and value are required' }, { status: 400 });
    }

    // 更新API密钥
    const updatedKey = await APIKey.findByIdAndUpdate(
      id,
      {
        name,
        type,
        value: value.slice(0, 4) + '********************',
        status: value.length > 10 ? 'active' : 'inactive',
        updatedAt: new Date(),
        lastChecked: new Date()
      },
      { new: true }
    );

    if (!updatedKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, apiKey: updatedKey }, { status: 200 });
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

    // 连接到数据库
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing API key id' }, { status: 400 });
    }

    // 删除API密钥
    const deletedKey = await APIKey.findByIdAndDelete(id);

    if (!deletedKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deletedKey._id }, { status: 200 });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}