import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '../../../../lib/auth';
import { initializeDatabase } from '../../../../lib/init-database';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 检查管理员是否已认证
    const isAuthenticated = await isAdminAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 初始化数据库
    const result = await initializeDatabase();

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Database initialized successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ success: false, error: 'Failed to initialize database' }, { status: 500 });
  }
}