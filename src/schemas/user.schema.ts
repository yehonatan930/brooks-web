import mongoose from "mongoose";

export const userSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tokens: { type: [String], required: true },
});

export interface IUser {
  _id?: String;
  username: string;
  email: string;
  password: string;
  tokens: string[];
}
