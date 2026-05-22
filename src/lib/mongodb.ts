import mongoose from 'mongoose';

// 简单的连接管理，不使用global变量
let conn: mongoose.Connection | null = null;
let isConnecting = false;

// 数据库连接URL
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/cyber-buddha';

async function connectMongoDB() {
  // 如果已经连接，直接返回
  if (conn) {
    return conn;
  }

  // 如果正在连接，等待连接完成
  if (isConnecting) {
    // 等待当前连接完成，但设置超时
    await new Promise((resolve, reject) => {
      const checkConnection = setInterval(() => {
        if (conn) {
          clearInterval(checkConnection);
          resolve(conn);
        }
      }, 100);
      
      // 5秒超时
      setTimeout(() => {
        clearInterval(checkConnection);
        reject(new Error('MongoDB connection timeout'));
      }, 5000);
    });
    return conn!;
  }

  try {
    isConnecting = true;

    // 检查是否有环境变量
    console.log('MongoDB URI:', MONGODB_URI ? '已配置' : '未配置');
    console.log('MongoDB URI 前20字符:', MONGODB_URI ? MONGODB_URI.substring(0, 20) + '...' : 'N/A');

    // 连接到MongoDB - 新版mongoose不再需要useNewUrlParser和useUnifiedTopology选项
    // 添加超时设置
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5秒服务器选择超时
      socketTimeoutMS: 5000, // 5秒套接字超时
    });

    conn = mongooseInstance.connection;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    isConnecting = false;
    throw error;
  } finally {
    if (conn) {
      isConnecting = false;
    }
  }
}

// 初始化数据库连接 - 不要在模块加载时自动连接，避免启动时阻塞
// connectMongoDB();

export default connectMongoDB;