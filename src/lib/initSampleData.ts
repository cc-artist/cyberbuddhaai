import connectMongoDB from './mongodb';
import Payment from '../models/Payment';
import Consultation from '../models/Consultation';
import Comment from '../models/Comment';

// 初始化示例数据
export async function initSampleData() {
  try {
    await connectMongoDB();
    console.log('Connected to MongoDB for data initialization');

    // 检查是否已有数据
    const existingPayments = await Payment.countDocuments();
    const existingConsultations = await Consultation.countDocuments();
    const existingComments = await Comment.countDocuments();

    console.log(`Existing data - Payments: ${existingPayments}, Consultations: ${existingConsultations}, Comments: ${existingComments}`);

    if (existingPayments === 0) {
      // 创建示例支付数据
      const samplePayments = [
        {
          orderNumber: 'ORD20260515001',
          user: '张三',
          userEmail: 'zhangsan@example.com',
          amount: 99,
          currency: 'CNY',
          status: 'completed',
          paymentPlatform: 'paypal',
          serviceType: 'temple-blessing',
          templeName: '灵隐寺',
        },
        {
          orderNumber: 'ORD20260515002',
          user: '李四',
          userEmail: 'lisi@example.com',
          amount: 199,
          currency: 'CNY',
          status: 'completed',
          paymentPlatform: 'pingpong',
          serviceType: 'lamp-blessing',
          templeName: '少林寺',
        },
        {
          orderNumber: 'ORD20260515003',
          user: '王五',
          userEmail: 'wangwu@example.com',
          amount: 29.99,
          currency: 'USD',
          status: 'pending',
          paymentPlatform: 'paypal',
          serviceType: 'temple-blessing',
          templeName: '南华寺',
        }
      ];
      await Payment.insertMany(samplePayments);
      console.log('Sample payments created');
    }

    if (existingConsultations === 0) {
      // 创建示例咨询数据
      const sampleConsultations = [
        {
          name: '赵六',
          email: 'zhaoliu@example.com',
          subject: '关于加持服务的咨询',
          message: '我想了解一下加持服务的具体流程和时间',
          templeName: '赛博佛祖殿',
          status: 'pending',
        },
        {
          name: '孙七',
          email: 'sunqi@example.com',
          subject: '费用咨询',
          message: '请问加持服务的费用是如何计算的？',
          templeName: '灵隐寺',
          status: 'replied',
        }
      ];
      await Consultation.insertMany(sampleConsultations);
      console.log('Sample consultations created');
    }

    if (existingComments === 0) {
      // 创建示例评论数据
      const sampleComments = [
        {
          imageUrl: '/temple-images/灵隐寺.webp',
          title: '我的第一次数字加持体验',
          description: '非常棒的体验！',
          pageUrl: 'https://cyberbuddhaai.vercel.app',
          userName: '用户A',
          userComment: '愿和平与智慧充满你的心',
          userAvatar: 'https://ui-avatars.com/api/?name=UserA&background=random',
          approved: true,
        },
        {
          imageUrl: '/temple-images/少林寺.webp',
          title: '数字化的数字加持服务太棒了',
          description: '技术与灵性的完美结合',
          pageUrl: 'https://cyberbuddhaai.vercel.app',
          userName: '用户B',
          userComment: '非常推荐这个服务',
          userAvatar: 'https://ui-avatars.com/api/?name=UserB&background=random',
          approved: true,
        },
        {
          imageUrl: '/temple-images/南华寺.webp',
          title: '我的设备现在感觉不一样了',
          description: '每次使用都感到很安心',
          pageUrl: 'https://cyberbuddhaai.vercel.app',
          userName: '用户C',
          userComment: '工作时更有动力和平安',
          userAvatar: 'https://ui-avatars.com/api/?name=UserC&background=random',
          approved: true,
        }
      ];
      await Comment.insertMany(sampleComments);
      console.log('Sample comments created');
    }

    console.log('Sample data initialization completed');
    return { success: true };
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return { success: false, error };
  }
}

export default initSampleData;
