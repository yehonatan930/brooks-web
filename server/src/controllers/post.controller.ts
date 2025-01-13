import express from 'express';
import mongoose from 'mongoose';
import { IPost, postSchema } from '../schemas/post.schema';
const router = express.Router();

const Post = mongoose.model('Post', postSchema);

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
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter posts by userId ID
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
router.get('/', async (req, res) => {
  const { userId } = req.user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10; // Number of posts per page

  try {
    const query = userId ? { userId } : {};
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ posts, totalPages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  const { userId } = req.user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10; // Number of posts per page

  try {
    const totalPosts = await Post.countDocuments({});
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ posts, totalPages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post: IPost = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
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
 *               :
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               id: "64d2f8b0b9f8c9a1a5f8b3c3"
 *               : "Updated Title"
 *               content: "Updated content"
 *               userId: "12345"
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
router.put('/', async (req, res) => {
  if (!mongoose.isValidObjectId(req.body._id)) {
    return res.status(404).json({ error: 'Post not found' });
  }
  try {
    const updatedPost: IPost = await Post.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedPost)
      return res.status(404).json({ message: 'Post not found' });

    res.status(201).json(updatedPost);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error updating post', error: err.message });
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
 *               -
 *               - content
 *               - userId
 *             properties:
 *               :
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               : "Sample Post"
 *               content: "This is a sample post."
 *               userId: "12345"
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
router.post('/', async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating post', error: err.message });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       204:
 *         description: Post unliked successfully
 *       404:
 *         description: Post not found
 */
router.post('/:id/like', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId; // Assuming user ID is available in req.user

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post: IPost = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId === userId) {
      return res.status(400).json({ error: 'You cannot like your own post' });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id: string) => id !== userId);
      await post.save();
      return res.status(200).json({ message: 'Post unliked successfully' });
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
