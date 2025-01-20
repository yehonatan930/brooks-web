import express from 'express';
import { upload } from '../utils/storage';
const router = express.Router();

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
