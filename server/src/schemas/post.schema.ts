import mongoose from 'mongoose';

export interface IPost
  extends mongoose.Document<mongoose.Schema.Types.ObjectId> {
  bookTitle: string;
  content: string;
  userId: string;
}

export const postSchema = new mongoose.Schema<IPost>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  bookTitle: { type: String, required: true },
  content: { type: String, required: false },
  userId: { type: String, required: true, ref: 'User' },
});
