import mongoose from 'mongoose';

// 定义全局类型扩展
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// 全局连接缓存
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongoDB() {
  // 如果已有连接，直接返回
  if (cached?.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  // 如果正在连接，等待连接完成
  if (!cached?.promise) {
    const MONGODB_URI = process.env.DATABASE_URL;

    if (!MONGODB_URI) {
      throw new Error('Please define the DATABASE_URL environment variable');
    }

    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    if (cached) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
        console.log('MongoDB connected successfully');
        return mongooseInstance.connection;
      }).catch((error) => {
        console.error('MongoDB connection error:', error);
        if (cached) {
          cached.promise = null;
        }
        throw error;
      });
    }
  }

  try {
    if (cached?.promise) {
      cached.conn = await cached.promise;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
    }
    throw e;
  }

  return cached?.conn;
}

export default connectMongoDB;
