export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const dynamicParams = true;
export const generateStaticParams = () => [];

import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';

export async function GET() {
  console.log('[Health Check] Starting health check...');
  
  const healthInfo: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  // 检查数据库连接
  try {
    console.log('[Health Check] Testing database connection...');
    await connectMongoDB();
    healthInfo.checks.database = 'connected';
    console.log('[Health Check] Database connection successful');
  } catch (error) {
    console.error('[Health Check] Database connection failed:', error);
    healthInfo.checks.database = 'failed';
    healthInfo.status = 'degraded';
    healthInfo.error = error instanceof Error ? error.message : String(error);
  }

  // 检查环境变量
  healthInfo.checks.databaseUrl = process.env.DATABASE_URL ? 'configured' : 'not configured';
  
  console.log('[Health Check] Complete:', healthInfo);
  
  const statusCode = healthInfo.status === 'healthy' ? 200 : 503;
  return NextResponse.json(healthInfo, { status: statusCode });
}
