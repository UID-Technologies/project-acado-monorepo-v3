// src/modules/upload/upload.service.ts
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';
import { logger } from '../../config/logger.js';
import { ApiError } from '../../core/http/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_ACCOUNT_URL = process.env.AZURE_STORAGE_ACCOUNT_URL;

const isAzureConfigured = Boolean(AZURE_CONNECTION_STRING && AZURE_CONTAINER_NAME);

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: ReturnType<BlobServiceClient['getContainerClient']> | null = null;

const initAzure = () => {
  if (!isAzureConfigured) {
    return;
  }

  if (!blobServiceClient) {
    const connectionString = AZURE_CONNECTION_STRING!;
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  if (!containerClient) {
    containerClient = blobServiceClient!.getContainerClient(AZURE_CONTAINER_NAME!);
  }
};

const uploadToAzure = async (localFilePath: string, originalName: string): Promise<string> => {
  initAzure();

  if (!containerClient) {
    throw new ApiError(500, 'Azure Blob container is not configured.');
  }

  const uniqueName = `${Date.now()}-${randomUUID()}-${originalName.replace(/\s+/g, '_')}`;
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(uniqueName);

  await blockBlobClient.uploadFile(localFilePath, {
    blobHTTPHeaders: {
      blobContentType: mimeTypeFromFilename(originalName),
      blobCacheControl: 'public, max-age=31536000',
    },
  });

  try {
    fs.unlinkSync(localFilePath);
  } catch (error) {
    logger.warn({ err: error }, 'Failed to remove temporary upload file');
  }

  if (AZURE_ACCOUNT_URL) {
    return `${AZURE_ACCOUNT_URL.replace(/\/$/, '')}/${containerClient.containerName}/${uniqueName}`;
  }

  return blockBlobClient.url;
};

const mimeTypeFromFilename = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return map[ext] ?? 'application/octet-stream';
};

export interface UploadFileResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  fieldName: string;
}

export class UploadService {
  async uploadFile(file: Express.Multer.File, fieldName?: string): Promise<UploadFileResult> {
    logger.info('Upload request received', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      fieldName,
      azureConfigured: isAzureConfigured,
    });

    if (!file) {
      throw new ApiError(400, 'No file uploaded', 'NO_FILE', { message: 'Please provide a file to upload' });
    }

    // ⚠️ ENFORCE AZURE BLOB STORAGE - No local storage allowed
    if (!isAzureConfigured) {
      logger.error('Azure Blob Storage not configured');
      throw new ApiError(500, 'Upload configuration error', 'AZURE_NOT_CONFIGURED', {
        message: 'Azure Blob Storage is not configured. Please contact administrator.',
        hint: 'Set AZURE_STORAGE_CONNECTION_STRING, AZURE_CONTAINER_NAME, and AZURE_STORAGE_ACCOUNT_URL',
      });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      logger.error({ path: file.path }, 'File not found on disk');
      throw new ApiError(500, 'Upload failed', 'FILE_NOT_FOUND', {
        message: 'Uploaded file not found on server',
      });
    }

    let fileUrl: string;

    logger.info('Uploading to Azure Blob Storage...');
    try {
      fileUrl = await uploadToAzure(file.path, file.originalname);
      logger.info({ fileUrl }, 'Azure upload successful');

      // Clean up temporary local file after successful Azure upload
      try {
        fs.unlinkSync(file.path);
        logger.info({ path: file.path }, 'Temporary file cleaned up');
      } catch (cleanupError: any) {
        logger.warn({ err: cleanupError }, 'Failed to cleanup temp file');
        // Don't throw - file was uploaded successfully
      }
    } catch (azureError: any) {
      logger.error({ err: azureError }, 'Azure upload failed');
      // Clean up temp file on failure too
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      throw new ApiError(500, `Azure upload failed: ${azureError.message}`, 'AZURE_UPLOAD_FAILED');
    }

    logger.info('Upload successful');
    return {
      url: fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      fieldName: fieldName || 'file',
    };
  }

  async getFile(filename: string): Promise<{ filePath: string; contentType: string }> {
    if (isAzureConfigured) {
      throw new ApiError(404, 'File retrieval not available', 'AZURE_STORAGE_MODE', {
        message: 'Direct file retrieval is not supported when using Azure Blob Storage.',
      });
    }

    const uploadsDir = path.join(__dirname, '../../../uploads');
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError(404, 'File not found', 'FILE_NOT_FOUND', {
        message: 'The requested file does not exist',
      });
    }

    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return { filePath, contentType };
  }
}

export const uploadService = new UploadService();
