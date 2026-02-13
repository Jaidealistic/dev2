import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import crypto from 'crypto';

// Configure storage location
const uploadDir = path.join(process.cwd(), 'uploads', 'work-samples');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random-originalname
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${timestamp}-${uniqueId}-${safeName}${ext}`);
  },
});

// File filter for allowed types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types for work samples
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain',
    'text/csv',
    // Video
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: images, PDFs, documents, videos, audio.`));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
});

/**
 * Get public URL for uploaded file
 */
export function getFileUrl(filename: string): string {
  // In production, this would be an S3 URL or CDN URL
  // For now, return a relative URL that the backend will serve
  return `/uploads/work-samples/${filename}`;
}

/**
 * Delete file from storage
 */
export async function deleteFile(filename: string): Promise<void> {
  const filePath = path.join(uploadDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get file info
 */
export function getFileInfo(filename: string) {
  const filePath = path.join(uploadDir, filename);
  try {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    return {
      exists: false,
    };
  }
}

/**
 * Validate file size before upload
 */
export function validateFileSize(size: number): boolean {
  const maxSize = 50 * 1024 * 1024; // 50MB
  return size <= maxSize;
}
