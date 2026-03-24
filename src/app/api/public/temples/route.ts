import { NextResponse } from 'next/server';
import { temples as mockTemples } from '../../../../data/TempleData';

export async function GET() {
  try {
    // 这里应该从数据库获取数据，现在使用mock数据
    // 这个API不需要认证，用于前端公开访问
    return NextResponse.json(mockTemples, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch temples' }, { status: 500 });
  }
}