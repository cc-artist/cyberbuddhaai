import mongoose, { Document } from 'mongoose';

// 定义Payment文档类型
interface PaymentDocument extends Document {
  id: string;
  user: string;
  amount: number;
  currency: 'CNY' | 'USD' | 'EUR' | 'GBP' | 'JPY';
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  paymentPlatform: 'paypal' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema<PaymentDocument>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['CNY', 'USD', 'EUR', 'GBP', 'JPY'],
    default: 'CNY'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'cancelled', 'refunded'],
    required: true,
    default: 'pending'
  },
  paymentPlatform: {
    type: String,
    enum: ['paypal', 'unknown'],
    default: 'unknown'
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