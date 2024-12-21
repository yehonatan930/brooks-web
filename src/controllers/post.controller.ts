import express from "express";
import mongoose from "mongoose";
import { IPost, postSchema } from "../schemas/post.schema";
const router = express.Router();

const Post = mongoose.model("Post", postSchema);

// get all posts
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

// Get a Post by ID
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

// update a Post
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

// Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating post", error: err.message });
  }
});

export default router;
