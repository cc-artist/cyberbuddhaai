import mongoose from 'mongoose';

// 简单的连接管理，不使用global变量
let conn: mongoose.Connection | null = null;
let isConnecting = false;

// 数据库连接URL
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/cyber-buddha';

async function connectMongoDB() {
  console.log('Attempting to connect to MongoDB...');
  
  // 如果已经连接，直接返回
  if (conn && conn.readyState === 1) {
    console.log('MongoDB already connected');
    return conn;
  }

  // 如果正在连接，等待连接完成
  if (isConnecting) {
    console.log('MongoDB connection already in progress, waiting...');
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

<<<<<<< Updated upstream
    console.log('Connecting to MongoDB with URI:', MONGODB_URI.replace(/:([^:@]{10,})@/, ':***@'));

    // 连接到MongoDB - 添加超时配置
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
=======
    // 连接到MongoDB - 新版mongoose不再需要useNewUrlParser和useUnifiedTopology选项
    // 增加超时设置以适应MongoDB Atlas
    const mongooseInstance = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10秒服务器选择超时
      socketTimeoutMS: 45000, // 45秒套接字超时
      connectTimeoutMS: 10000, // 10秒连接超时
>>>>>>> Stashed changes
    });

    conn = mongooseInstance.connection;
    console.log('✅ MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnecting = false;
    conn = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

export default connectMongoDB;