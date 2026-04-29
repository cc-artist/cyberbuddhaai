import connectMongoDB from './mongodb';
import Payment from '../models/Payment';
import Consultation from '../models/Consultation';
import Comment from '../models/Comment';
import APIKey from '../models/APIKey';

// 示例支付数据
const samplePayments = [
  { id: 'PAY20260207001', user: '张三', amount: 100, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 10:30:00') },
  { id: 'PAY20260207002', user: '李四', amount: 200, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 11:15:00') },
  { id: 'PAY20260207005', user: '孙七', amount: 250, status: 'completed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 15:10:00') },
  { id: 'PAY20260207007', user: '吴九', amount: 400, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 17:45:00') },
  { id: 'PAY20260207008', user: '郑十', amount: 120, status: 'completed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 18:20:00') },
  { id: 'PAY20260207009', user: '陈一', amount: 50, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 19:00:00') },
  { id: 'PAY20260207010', user: '林二', amount: 350, status: 'completed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 19:30:00') },
  { id: 'PAY20260207011', user: '黄三', amount: 80, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 20:00:00') },
  { id: 'PAY20260207003', user: '王五', amount: 150, status: 'pending', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 12:45:00') },
  { id: 'PAY20260207006', user: '周八', amount: 180, status: 'pending', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 16:30:00') },
  { id: 'PAY20260207012', user: '刘四', amount: 220, status: 'pending', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 20:30:00') },
  { id: 'PAY20260207013', user: '杨五', amount: 130, status: 'pending', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 21:00:00') },
  { id: 'PAY20260207004', user: '赵六', amount: 300, status: 'failed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 14:20:00') },
  { id: 'PAY20260207014', user: '朱六', amount: 90, status: 'failed', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 21:30:00') },
  { id: 'PAY20260207015', user: '秦七', amount: 170, status: 'cancelled', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 22:00:00') },
  { id: 'PAY20260207016', user: '尤八', amount: 240, status: 'cancelled', paymentPlatform: 'pingpong', createdAt: new Date('2026-02-07 22:30:00') },
  { id: 'PAY20260207017', user: '许九', amount: 0, status: 'completed', paymentPlatform: 'paypal', createdAt: new Date('2026-02-07 23:00:00') }
];

// 示例咨询数据
const sampleConsultations = [
  { name: '张三', email: 'zhangsan@example.com', subject: '关于数字加持的疑问', message: '请问数字加持的效果能持续多久？', templeName: '赛博佛祖殿', status: 'pending', createdAt: new Date('2026-02-07 10:00:00') },
  { name: '李四', email: 'lisi@example.com', subject: 'API集成问题', message: '我想将你们的API集成到我的应用中，需要什么权限？', templeName: '赛博佛祖殿', status: 'pending', createdAt: new Date('2026-02-07 11:30:00') },
  { name: '王五', email: 'wangwu@example.com', subject: '支付问题', message: '我支付后没有收到确认邮件', templeName: '赛博佛祖殿', status: 'resolved', createdAt: new Date('2026-02-06 14:00:00'), updatedAt: new Date('2026-02-06 15:00:00') },
  { name: '赵六', email: 'zhaoliu@example.com', subject: '技术支持', message: '生成的动画无法下载', templeName: '赛博佛祖殿', status: 'processing', createdAt: new Date('2026-02-07 09:00:00') },
  { name: '孙七', email: 'sunqi@example.com', subject: '批量加持', message: '是否支持批量上传物品进行加持？', templeName: '赛博佛祖殿', status: 'pending', createdAt: new Date('2026-02-07 16:00:00') }
];

// 示例评论数据
const sampleComments = [
  {
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20a%20keyboard%20with%20golden%20light&image_size=portrait_4_3',
    title: 'Digital Blessing',
    description: 'Keyboard blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 10:30:00'),
    userName: '张三',
    userComment: '非常神奇的体验，感谢赛博佛祖！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    approved: true
  },
  {
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20airpods%20with%20golden%20light&image_size=portrait_4_3',
    title: 'AirPods Blessing',
    description: 'AirPods blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 11:15:00'),
    userName: '李四',
    userComment: '音质变得更好了！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    approved: true
  },
  {
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20phone%20with%20golden%20light&image_size=portrait_4_3',
    title: 'Phone Blessing',
    description: 'Phone blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 12:45:00'),
    userName: '王五',
    userComment: '手机信号变强了，不可思议！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    approved: false
  },
  {
    imageUrl: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cyber%20buddha%20blessing%20laptop%20with%20golden%20light&image_size=portrait_4_3',
    title: 'Laptop Blessing',
    description: 'Laptop blessing completed',
    pageUrl: '/consecration',
    createdAt: new Date('2026-02-07 14:20:00'),
    userName: '赵六',
    userComment: '工作效率提升了很多！',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    approved: true
  }
];

// 示例API密钥数据
const sampleAPIKeys = [
  {
    name: 'OpenAI API Key',
    type: 'openai',
    value: process.env.OPENAI_API_KEY ? 'sk-********************' : '未配置',
    status: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10 ? 'active' : 'inactive',
    lastChecked: new Date()
  },
  {
    name: 'PayPal API Key',
    type: 'paypal',
    value: process.env.PAYPAL_API_KEY ? '********************' : '未配置',
    status: !!process.env.PAYPAL_API_KEY && process.env.PAYPAL_API_KEY.length > 10 ? 'active' : 'inactive',
    lastChecked: new Date()
  },
  {
    name: 'PingPong API Key',
    type: 'pingpong',
    value: process.env.PINGPONG_API_KEY ? '********************' : '未配置',
    status: !!process.env.PINGPONG_API_KEY && process.env.PINGPONG_API_KEY.length > 10 ? 'active' : 'inactive',
    lastChecked: new Date()
  }
];

export async function initializeDatabase() {
  try {
    // 连接到数据库
    await connectMongoDB();
    console.log('Database connected successfully');

    // 检查并初始化Payment集合
    const paymentCount = await Payment.countDocuments();
    if (paymentCount === 0) {
      await Payment.insertMany(samplePayments);
      console.log(`Initialized ${samplePayments.length} payment records`);
    } else {
      console.log(`Payment collection already has ${paymentCount} records`);
    }

    // 检查并初始化Consultation集合
    const consultationCount = await Consultation.countDocuments();
    if (consultationCount === 0) {
      await Consultation.insertMany(sampleConsultations);
      console.log(`Initialized ${sampleConsultations.length} consultation records`);
    } else {
      console.log(`Consultation collection already has ${consultationCount} records`);
    }

    // 检查并初始化Comment集合
    const commentCount = await Comment.countDocuments();
    if (commentCount === 0) {
      await Comment.insertMany(sampleComments);
      console.log(`Initialized ${sampleComments.length} comment records`);
    } else {
      console.log(`Comment collection already has ${commentCount} records`);
    }

    // 检查并初始化APIKey集合
    const apiKeyCount = await APIKey.countDocuments();
    if (apiKeyCount === 0) {
      await APIKey.insertMany(sampleAPIKeys);
      console.log(`Initialized ${sampleAPIKeys.length} API key records`);
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