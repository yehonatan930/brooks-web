import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { userSchema } from "../schemas/user.schema";

const User = mongoose.model("User", userSchema);

const router = express.Router();

const generateToken = (userId: string, secret: string, expiresIn: string) => {
  return jwt.sign({ userId }, secret, { expiresIn });
};

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const emailExists = await User.findOne({
    email,
  });

  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      _id: uuidv4(),
      username,
      email,
      password: encryptedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken(
      user._id,
      process.env.ACCESS_TOKEN_SECRET as string,
      process.env.REFRESH_TIMEOUT
    );
    const refreshToken = generateToken(
      user._id,
      process.env.REFRESH_TOKEN_SECRET as string,
      "1h"
    );

    user.tokens.push(refreshToken);
    console.debug("regresh userId ", user._id);
    console.debug("login user tkon:", user.tokens);
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: jwt.VerifyErrors, userInfo: jwt.JwtPayload) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden jwt err" });
        }

        const userId = userInfo.userId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        console.debug("regresh userId ", userId);
        console.debug("regresh user.tokens ", user.tokens);

        if (!user.tokens.includes(token)) {
          user.tokens = [];
          await user.save();
          return res.status(403).json({ message: "Forbidden user tokens" });
        }

        const accessToken = generateToken(
          user._id,
          process.env.ACCESS_TOKEN_SECRET as string,
          process.env.REFRESH_TIMEOUT
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error refreshing token" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: jwt.VerifyErrors, userInfo: jwt.JwtPayload) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const userId = userInfo._id;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.tokens = [];
        await user.save();
        res.json({ message: "User logged out" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out user" });
  }
});

export default router;
