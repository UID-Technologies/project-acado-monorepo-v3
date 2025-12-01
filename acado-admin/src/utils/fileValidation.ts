/**
 * File Validation Utilities
 * Validates files before upload to provide immediate feedback
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

const defaultOptions: FileValidationOptions = {
  maxSizeMB: 10,
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.doc', '.docx']
};

/**
 * Validate a file before upload
 */
export function validateFile(
  file: File | null | undefined,
  options: FileValidationOptions = {}
): FileValidationResult {
  const opts = { ...defaultOptions, ...options };

  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file selected. Please choose a file to upload.'
    };
  }

  // Check file size
  const maxSizeBytes = (opts.maxSizeMB || 10) * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileSizeMB} MB) exceeds maximum allowed size (${opts.maxSizeMB} MB)`
    };
  }

  // Check MIME type
  if (opts.allowedTypes && opts.allowedTypes.length > 0) {
    if (!opts.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not allowed. Allowed types: ${getReadableFileTypes(opts.allowedTypes)}`
      };
    }
  }

  // Check file extension
  if (opts.allowedExtensions && opts.allowedExtensions.length > 0) {
    const extension = getFileExtension(file.name);
    if (!opts.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension "${extension}" is not allowed. Allowed extensions: ${opts.allowedExtensions.join(', ')}`
      };
    }
  }

  return { valid: true };
}

/**
 * Validate image file specifically (for logos and images)
 */
export function validateImageFile(file: File | null | undefined, maxSizeMB: number = 10): FileValidationResult {
  return validateFile(file, {
    maxSizeMB,
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml'
    ],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg']
  });
}

/**
 * Validate document file (PDF, Word)
 */
export function validateDocumentFile(file: File | null | undefined, maxSizeMB: number = 10): FileValidationResult {
  return validateFile(file, {
    maxSizeMB,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    allowedExtensions: ['.pdf', '.doc', '.docx']
  });
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Convert MIME types to readable format
 */
function getReadableFileTypes(mimeTypes: string[]): string {
  const readable = mimeTypes.map(type => {
    if (type.startsWith('image/')) {
      return type.replace('image/', '').toUpperCase();
    }
    if (type === 'application/pdf') return 'PDF';
    if (type === 'application/msword') return 'DOC';
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'DOCX';
    return type;
  });
  return readable.join(', ');
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is a document
 */
export function isDocumentFile(file: File): boolean {
  return file.type.startsWith('application/');
}

