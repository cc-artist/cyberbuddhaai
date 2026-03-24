import mongoose, { Document } from 'mongoose';

// 定义Consultation文档类型
interface ConsultationDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  templeName: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new mongoose.Schema<ConsultationDocument>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  templeName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    required: true,
    default: 'pending'
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
const Consultation = mongoose.models.Consultation as mongoose.Model<ConsultationDocument> || mongoose.model<ConsultationDocument>('Consultation', ConsultationSchema);

export default Consultation;