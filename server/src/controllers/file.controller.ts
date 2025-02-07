import express from 'express';
import { upload } from '../utils/storage';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload endpoint
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */

// upload.single('file') is a middleware that processes a single file upload.
// It expects the name of the file input field in the form data. In this case, it's 'file'.
// It sets the file object on the req.file property.
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      return res.status(200).json({ url: req.file.path });
    }

    res.status(400).json({ error: 'No file uploaded' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
