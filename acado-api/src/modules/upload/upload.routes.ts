// src/modules/upload/upload.routes.ts
import { Router } from 'express';
import { uploadController } from './upload.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const sanitizeFilename = (filename: string): string => {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 50);
  return sanitized + ext.toLowerCase();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fieldName = req.body.fieldName || 'file';
    const sanitizedOriginal = sanitizeFilename(file.originalname);
    const ext = path.extname(sanitizedOriginal);
    const baseName = path.basename(sanitizedOriginal, ext);
    cb(null, `${fieldName}-${uniqueSuffix}-${baseName}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Invalid file type. Allowed formats: PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP, SVG.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size exceeds the 10MB limit',
        code: err.code
      });
    }
    return res.status(400).json({
      error: 'Upload error',
      message: err.message,
      code: err.code
    });
  } else if (err) {
    return res.status(400).json({
      error: 'Invalid file',
      message: err.message
    });
  }
  next();
};

const router = Router();

router.post('/', requireAuth, upload.single('file'), handleMulterError, uploadController.uploadFile);
router.get('/:filename', uploadController.getFile);

export default router;

