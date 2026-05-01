import mongoose, { Document } from 'mongoose';

// 定义APIKey文档类型
interface APIKeyDocument extends Document {
  name: string;
  type: 'openai' | 'paypal' | 'pingpong' | 'other';
  value: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lastChecked: Date;
}

const APIKeySchema = new mongoose.Schema<APIKeyDocument>({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['openai', 'paypal', 'pingpong', 'other'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastChecked: {
    type: Date,
    default: Date.now
  }
});

// 确保模型不会被重复定义
const APIKey = mongoose.models.APIKey as mongoose.Model<APIKeyDocument> || mongoose.model<APIKeyDocument>('APIKey', APIKeySchema);

export default APIKey;