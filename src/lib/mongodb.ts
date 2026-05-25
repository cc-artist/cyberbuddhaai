import mongoose from 'mongoose';

// 简单的连接管理，不使用global变量
let conn: mongoose.Connection | null = null;
let isConnecting = false;

async function connectMongoDB() {
  // 如果已经连接，直接返回
  if (conn) {
    return conn;
  }

  // 如果正在连接，等待连接完成
  if (isConnecting) {
    // 等待当前连接完成
    await new Promise(resolve => {
      const checkConnection = setInterval(() => {
        if (conn) {
          clearInterval(checkConnection);
          resolve(conn);
        }
      }, 100);
    });
    return conn!;
  }

  // 数据库连接URL - 在运行时检查
  const MONGODB_URI = process.env.DATABASE_URL as string;
  
  if (!MONGODB_URI) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
  }

  try {
    isConnecting = true;
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI:', MONGODB_URI.replace(/\/\/.*@/, '//****:****@'));

    // 连接到MongoDB - 强制使用云数据库
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000
    });

    conn = mongooseInstance.connection;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnecting = false;
    // 强制抛出错误，不允许降级方案
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (conn) {
      isConnecting = false;
    }
  }
}

export default connectMongoDB;