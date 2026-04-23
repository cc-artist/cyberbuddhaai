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

    // 连接到MongoDB - 新版mongoose不再需要useNewUrlParser和useUnifiedTopology选项
    // 添加超时设置
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // 3秒服务器选择超时
      socketTimeoutMS: 3000, // 3秒套接字超时
    });

    conn = mongooseInstance.connection;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
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