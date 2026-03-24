import mongoose from 'mongoose';
import Payment from '../models/Payment';
import connectMongoDB from './mongodb';

async function initSampleData() {
  // 示例支付数据
  const samplePayments = [
    { id: 'PAY20260207001', user: '张三', amount: 100, status: 'completed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 10:30:00') },
    { id: 'PAY20260207002', user: '李四', amount: 200, status: 'completed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 11:15:00') },
    { id: 'PAY20260207005', user: '孙七', amount: 250, status: 'completed' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 15:10:00') },
    { id: 'PAY20260207007', user: '吴九', amount: 400, status: 'completed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 17:45:00') },
    { id: 'PAY20260207008', user: '郑十', amount: 120, status: 'completed' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 18:20:00') },
    { id: 'PAY20260207009', user: '陈一', amount: 50, status: 'completed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 19:00:00') },
    { id: 'PAY20260207010', user: '林二', amount: 350, status: 'completed' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 19:30:00') },
    { id: 'PAY20260207011', user: '黄三', amount: 80, status: 'completed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 20:00:00') },
    { id: 'PAY20260207003', user: '王五', amount: 150, status: 'pending' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 12:45:00') },
    { id: 'PAY20260207006', user: '周八', amount: 180, status: 'pending' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 16:30:00') },
    { id: 'PAY20260207012', user: '刘四', amount: 220, status: 'pending' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 20:30:00') },
    { id: 'PAY20260207013', user: '杨五', amount: 130, status: 'pending' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 21:00:00') },
    { id: 'PAY20260207004', user: '赵六', amount: 300, status: 'failed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 14:20:00') },
    { id: 'PAY20260207014', user: '朱六', amount: 90, status: 'failed' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 21:30:00') },
    { id: 'PAY20260207015', user: '秦七', amount: 170, status: 'cancelled' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 22:00:00') },
    { id: 'PAY20260207016', user: '尤八', amount: 240, status: 'cancelled' as const, paymentPlatform: 'pingpong' as const, createdAt: new Date('2026-02-07 22:30:00') },
    { id: 'PAY20260207017', user: '许九', amount: 0, status: 'completed' as const, paymentPlatform: 'paypal' as const, createdAt: new Date('2026-02-07 23:00:00') }
  ];

  try {
    // 连接到数据库
    await connectMongoDB();

    // 检查是否已有数据
    const existingPayments = await Payment.find();
    if (existingPayments.length > 0) {
      console.log('数据库中已有数据，跳过初始化');
      return;
    }

    // 插入示例数据
    await Payment.insertMany(samplePayments);
    console.log('示例数据插入成功');
  } catch (error) {
    console.error('初始化示例数据失败:', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await mongoose.disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initSampleData();
}

export default initSampleData;