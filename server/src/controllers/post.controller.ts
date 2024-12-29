import express from "express";
import mongoose from "mongoose";
import { IPost, postSchema } from "../schemas/post.schema";
const router = express.Router();

const Post = mongoose.model("Post", postSchema);

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter posts by sender ID
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  const { sender } = req.query;
  if (!sender) {
    try {
      const posts: IPost[] = await Post.find();
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const posts: IPost[] = await Post.find({ sender });
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: The requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post: IPost = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               sender:
 *                 type: string
 *             example:
 *               id: "64d2f8b0b9f8c9a1a5f8b3c3"
 *               title: "Updated Title"
 *               content: "Updated content"
 *               sender: "12345"
 *     responses:
 *       200:
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */
router.put("/", async (req, res) => {
  try {
    const updatedPost: IPost = await Post.findByIdAndUpdate(
        req.body.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
    );
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    res.status(201).json(updatedPost);
  } catch (err) {
    res
        .status(400)
        .json({ message: "Error updating post", error: err.message });
  }
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - sender
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               sender:
 *                 type: string
 *             example:
 *               title: "Sample Post"
 *               content: "This is a sample post."
 *               sender: "12345"
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 */
router.post("/", async (req, res) => {
  try {
    console.debug(req.body);
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
});

export default router;
