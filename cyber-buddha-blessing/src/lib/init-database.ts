import connectMongoDB from './mongodb';
import Payment from '../models/Payment';
import Consultation from '../models/Consultation';
import Comment from '../models/Comment';
import APIKey from '../models/APIKey';

export async function initializeDatabase() {
  try {
    // 连接到数据库
    await connectMongoDB();
    console.log('Database connected successfully');

    // 检查并初始化Payment集合（不插入模拟数据）
    const paymentCount = await Payment.countDocuments();
    if (paymentCount === 0) {
      console.log('Payment collection is empty, no sample data added');
    } else {
      console.log(`Payment collection already has ${paymentCount} records`);
    }

    // 检查并初始化Consultation集合（不插入模拟数据）
    const consultationCount = await Consultation.countDocuments();
    if (consultationCount === 0) {
      console.log('Consultation collection is empty, no sample data added');
    } else {
      console.log(`Consultation collection already has ${consultationCount} records`);
    }

    // 检查并初始化Comment集合（不插入模拟数据）
    const commentCount = await Comment.countDocuments();
    if (commentCount === 0) {
      console.log('Comment collection is empty, no sample data added');
    } else {
      console.log(`Comment collection already has ${commentCount} records`);
    }

    // 检查并初始化APIKey集合
    const apiKeyCount = await APIKey.countDocuments();
    if (apiKeyCount === 0) {
      console.log('APIKey collection is empty, no sample data added');
    } else {
      console.log(`APIKey collection already has ${apiKeyCount} records`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
}

export default initializeDatabase;