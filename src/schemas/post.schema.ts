import mongoose from "mongoose";

export interface IPost
  extends mongoose.Document<mongoose.Schema.Types.ObjectId> {
  title: string;
  content: string;
  sender: string;
}

export const postSchema = new mongoose.Schema<IPost>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, required: true, ref: "User" },
});
