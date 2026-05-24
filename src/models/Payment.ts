import mongoose, { Document } from 'mongoose';

// 定义Payment文档类型
interface PaymentDocument extends Document {
  id?: string;
  orderNumber?: string;
  user: string;
  userEmail?: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  paymentPlatform: 'paypal' | 'pingpong' | 'unknown';
  platformTransactionId?: string;
  platformStatus?: string;
  callbackData?: any;
  serviceType?: string;
  templeName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema<PaymentDocument>({
  id: {
    type: String,
    unique: true,
    sparse: true
  },
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  user: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'cancelled', 'refunded'],
    required: true,
    default: 'pending'
  },
  paymentPlatform: {
    type: String,
    enum: ['paypal', 'pingpong', 'unknown'],
    default: 'unknown'
  },
  platformTransactionId: {
    type: String
  },
  platformStatus: {
    type: String
  },
  callbackData: {
    type: mongoose.Schema.Types.Mixed
  },
  serviceType: {
    type: String
  },
  templeName: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 确保模型不会被重复定义
const Payment = mongoose.models.Payment as mongoose.Model<PaymentDocument> || mongoose.model<PaymentDocument>('Payment', PaymentSchema);

export default Payment;