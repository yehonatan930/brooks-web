import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IUser, userSchema } from '../schemas/user.schema';
import _ from 'lodash';

const router = express.Router();

const User = mongoose.model("User", userSchema);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Fetch all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error fetching users
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Fetch a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user
 */
router.get("/user", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(_.pick(user, ['username', 'email', 'profilePicture']));
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - username
 *               - email
 *               - password
 *             properties:
 *               _id:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               tokens:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               _id: "1"
 *               username: "johndoe"
 *               email: "johndoe@example.com"
 *               password: "password123"
 *               tokens: []
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Error creating user
 */
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               tokens:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               username: "updateduser"
 *               email: "updated@example.com"
 *               password: "newpassword"
 *               tokens: []
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { username, email, password, profilePicture } = req.body;
    const user: IUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email, password, profilePicture },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ _id: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;
