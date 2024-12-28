import express from "express";
import mongoose from "mongoose";
import { commentSchema } from "../schemas/comment.schema";
const router = express.Router();

const Comment = mongoose.model("Comment", commentSchema);

// Delete a Comment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ _id: deletedComment._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Comment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content, author },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Comments
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId });
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add a New Comment
router.post("/", async (req, res) => {
  if (!req.body.sender || !req.body.content || !req.body.postId) {
    return res
      .status(400)
      .json({ error: "sender, content and postId are required" });
  }

  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
