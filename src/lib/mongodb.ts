import mongoose from 'mongoose';

// 简单的连接管理，不使用global变量
let conn: mongoose.Connection | null = null;
let isConnecting = false;

async function connectMongoDB() {
  console.log('[MongoDB] Starting connection process...');
  
  // 如果已经连接，直接返回
  if (conn) {
    console.log('[MongoDB] Using existing connection');
    return conn;
  }

  // 如果正在连接，等待连接完成
  if (isConnecting) {
    console.log('[MongoDB] Connection already in progress, waiting...');
    // 等待当前连接完成
    await new Promise(resolve => {
      const checkConnection = setInterval(() => {
        if (conn) {
          clearInterval(checkConnection);
          console.log('[MongoDB] Connection established while waiting');
          resolve(conn);
        }
      }, 100);
    });
    return conn!;
  }

  // 数据库连接URL - 在运行时检查
  const MONGODB_URI = process.env.DATABASE_URL as string;
  
  if (!MONGODB_URI) {
    const errorMsg = 'DATABASE_URL environment variable is not defined';
    console.warn('[MongoDB] ERROR: Please define the DATABASE_URL environment variable to use database features');
    throw new Error(errorMsg);
  }

  // 脱敏显示连接字符串（隐藏密码）
  let safeUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log('[MongoDB] Connection URI:', safeUri);

  try {
    isConnecting = true;
    console.log('[MongoDB] Attempting to connect to MongoDB...');

    // 连接到MongoDB - 优化配置以适应Vercel无服务器环境
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 增加到30秒，适应Vercel
      socketTimeoutMS: 60000, // 增加到60秒
      connectTimeoutMS: 30000, // 增加到30秒
      maxPoolSize: 10, // 连接池大小
      minPoolSize: 2, // 最小连接数
    });

    conn = mongooseInstance.connection;
    console.log('[MongoDB] MongoDB connected successfully');
    console.log('[MongoDB] Connected to host:', conn.host);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error details:');
    if (error instanceof Error) {
      console.error('[MongoDB] Error name:', error.name);
      console.error('[MongoDB] Error message:', error.message);
    }
    console.error('[MongoDB] Full error:', error);
    
    isConnecting = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error('Database connection failed: ' + errorMessage);
  } finally {
    if (conn) {
      isConnecting = false;
    }
  }
}

export default connectMongoDB;
