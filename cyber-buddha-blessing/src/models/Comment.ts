import mongoose, { Document } from 'mongoose';

// 定义Comment文档类型
interface CommentDocument extends Document {
  imageUrl: string;
  title: string;
  description: string;
  pageUrl: string;
  createdAt: Date;
  userName: string;
  userComment: string;
  userAvatar: string;
  approved?: boolean;
}

const CommentSchema = new mongoose.Schema<CommentDocument>({
  imageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userName: {
    type: String,
    required: true
  },
  userComment: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: true
  }
});

// 确保模型不会被重复定义
const Comment = mongoose.models.Comment as mongoose.Model<CommentDocument> || mongoose.model<CommentDocument>('Comment', CommentSchema);

export default Comment;