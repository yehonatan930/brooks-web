import mongoose from "mongoose";

export interface IPost {
  _id?: number;
  title: string;
  content: string;
  sender: string;
}

export const postSchema = new mongoose.Schema<IPost>({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, required: true, ref: "User" },
});
