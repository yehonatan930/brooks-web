const express = require("express");
const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");
const router = express.Router();

const Post = mongoose.model("Post", postSchema);

app.get('/posts', async (req, res) => {
  const { sender } = req.query;
  if (!sender) {
    return res.status(400).json({ error: 'Sender ID is required' });
  }

  try {
    const posts = await Post.find({ sender });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
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

module.exports = router;
