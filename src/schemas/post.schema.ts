import mongoose from "mongoose";

export interface IPost {
  _id?: number;
  title: string;
  content: string;
  sender: number;
}

export const postSchema = new mongoose.Schema<IPost>({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: Number, required: true, ref: "User" },
});
