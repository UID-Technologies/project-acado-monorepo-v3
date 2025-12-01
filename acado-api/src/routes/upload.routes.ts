// src/routes/upload.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/upload.controller.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
console.log('📁 Uploads directory path:', uploadsDir);
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created successfully');
  } catch (err) {
    console.error('❌ Failed to create uploads directory:', err);
    throw err;
  }
} else {
  console.log('✅ Uploads directory already exists');
}

const isAzureConfigured = Boolean(
  process.env.AZURE_STORAGE_CONNECTION_STRING && process.env.AZURE_CONTAINER_NAME,
);

// Sanitize filename to remove problematic characters
const sanitizeFilename = (filename: string): string => {
  // Get extension
  const ext = path.extname(filename);
  // Get name without extension
  const nameWithoutExt = path.basename(filename, ext);
  // Remove or replace problematic characters
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .substring(0, 50); // Limit length
  return sanitized + ext.toLowerCase();
};

// Configure multer storage
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

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow PDFs, Word documents, and images (including SVG for logos)
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml' // Added SVG support for university logos
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Invalid file type. Allowed formats: PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP, SVG.'));
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const r = Router();

// Error handler for multer
const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer error:', err);
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
    console.error('❌ File filter error:', err);
    return res.status(400).json({
      error: 'Invalid file',
      message: err.message
    });
  }
  next();
};

// Upload single file - requires authentication
r.post('/', requireAuth, upload.single('file'), handleMulterError, ctrl.uploadFile);

// Get uploaded file (for serving files) - public access for viewing/downloading
r.get('/:filename', ctrl.getFile);

export default r;
