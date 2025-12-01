// src/core/utils/file.ts

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

/**
 * Validate file size
 */
export function validateFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize;
}

/**
 * Validate file MIME type
 */
export function validateMimeType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Validate file extension
 */
export function validateExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Validate file based on options
 */
export function validateFile(
  file: { size: number; mimetype: string; originalname: string },
  options: FileValidationOptions
): { valid: boolean; error?: string } {
  const { maxSize, allowedMimeTypes, allowedExtensions } = options;

  if (maxSize && !validateFileSize(file.size, maxSize)) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize} bytes`,
    };
  }

  if (allowedMimeTypes && !validateMimeType(file.mimetype, allowedMimeTypes)) {
    return {
      valid: false,
      error: `File type ${file.mimetype} is not allowed`,
    };
  }

  if (allowedExtensions && !validateExtension(file.originalname, allowedExtensions)) {
    return {
      valid: false,
      error: `File extension is not allowed. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

