import express from 'express';
import { uploadImage, uploadVideo } from '../middleware/cloudinaryUpload.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public endpoint for users to upload payment screenshots (image)
router.post('/payment-screenshot', uploadImage, (req, res) => {
  try {
    if (!req.file || !req.file.path) return res.status(400).json({ message: 'No file uploaded' });
    return res.json({ url: req.file.path });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

// Admin-only endpoint for uploading intro videos / background images
router.post('/asset/image', authMiddleware, uploadImage, (req, res) => {
  try {
    if (!req.file || !req.file.path) return res.status(400).json({ message: 'No file uploaded' });
    return res.json({ url: req.file.path });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

router.post('/asset/video', authMiddleware, uploadVideo, (req, res) => {
  try {
    if (!req.file || !req.file.path) return res.status(400).json({ message: 'No file uploaded' });
    return res.json({ url: req.file.path });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
