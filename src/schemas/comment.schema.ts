import mongoose from "mongoose";

export interface IComment
  extends mongoose.Document<mongoose.Schema.Types.ObjectId> {
  postId: mongoose.Schema.Types.ObjectId;
  content: string;
  author: string;
}

export const commentSchema = new mongoose.Schema<IComment>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  author: { type: String, ref: "User", required: true },
});
