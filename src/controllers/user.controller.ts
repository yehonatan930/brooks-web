import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser, userSchema } from "../schemas/user.schema"; // For generating unique u
const router = express.Router();

const User = mongoose.model("User", userSchema);

// GET: Fetch all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// GET: Fetch a single user by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// POST: Create a new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { _id, username, email, password, tokens } = req.body;
    if (!_id || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newUser = new User({ _id, username, email, password, tokens });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// PUT: Update an existing user
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { username, email, password, tokens } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, password, tokens },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// DELETE: Remove a user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ _id: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;
