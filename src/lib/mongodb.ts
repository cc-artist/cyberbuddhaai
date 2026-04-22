import mongoose from 'mongoose';

// 简单的连接管理，不使用global变量
let conn: mongoose.Connection | null = null;
let isConnecting = false;

// 数据库连接URL
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/cyber-buddha';

async function connectMongoDB() {
  // 如果已经连接，直接返回
  if (conn && conn.readyState === 1) {
    return conn;
  }

  // 如果正在连接，等待连接完成
  if (isConnecting) {
    // 等待当前连接完成，最多等待10秒
    await new Promise(resolve => {
      let waited = 0;
      const checkConnection = setInterval(() => {
        if (conn && conn.readyState === 1) {
          clearInterval(checkConnection);
          resolve(conn);
        } else if (waited >= 10000) {
          clearInterval(checkConnection);
          resolve(null);
        }
        waited += 100;
      }, 100);
    });
    return conn;
  }

  try {
    isConnecting = true;

    // 连接到MongoDB - 默认启用buffering以支持离线操作
    const mongooseInstance = await mongoose.connect(MONGODB_URI);

    conn = mongooseInstance.connection;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnecting = false;
    conn = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

export default connectMongoDB;