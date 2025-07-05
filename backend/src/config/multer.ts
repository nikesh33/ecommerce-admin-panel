import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'ecommerce_products',
    allowed_formats: ['jpg','jpeg','png','webp'],
    transformation: [{ width: 800, crop: 'limit' }],
  })
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB
});
