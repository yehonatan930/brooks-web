import express, { Express } from "express";
import mongoose from "mongoose";
import postsController from "./controllers/post.controller";
import commentsController from "./controllers/comment.controller";
import authenticate from "./middlewares/auth.middleware";
import authController from "./controllers/auth.controller";
import usersController from "./controllers/user.controller";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const serverPromise: Promise<Express> = new Promise((resolve, reject) => {
  console.log("mongoURI ", mongoURI);

  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions)
    .then(() => {
      console.log("Connected to MongoDB");
      const app: Express = express();
      app.use(express.json());
      app.use(authenticate);
      app.use("/auth", authController);
      app.use("/posts", postsController);
      app.use("/comments", commentsController);
      app.use("/users", usersController);

      resolve(app);
    })
    .catch((err) => console.error(err));
});

export default serverPromise;
