import mongoose from "mongoose";

export interface IComment {
  _id?: number;
  postId: number;
  content: string;
  author: number;
}

export const commentSchema = new mongoose.Schema<IComment>({
  _id: { type: Number, required: true },
  postId: { type: Number, ref: "Post", required: true },
  content: { type: String, required: true },
  author: { type: Number, ref: "User", required: true },
});
