// src/controllers/upload.controller.ts
import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;
const AZURE_ACCOUNT_URL = process.env.AZURE_STORAGE_ACCOUNT_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    throw new Error('Azure Blob container is not configured.');
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
    console.warn('Failed to remove temporary upload file', error);
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

export const uploadFile = async (req: Request, res: Response) => {
  try {
    console.log('📤 Upload request received');
    console.log('File:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    } : 'No file');
    console.log('Field name:', req.body.fieldName);
    console.log('Azure configured:', isAzureConfigured);

    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please provide a file to upload'
      });
    }

    // ⚠️ ENFORCE AZURE BLOB STORAGE - No local storage allowed
    if (!isAzureConfigured) {
      console.error('❌ Azure Blob Storage not configured');
      return res.status(500).json({
        error: 'Upload configuration error',
        message: 'Azure Blob Storage is not configured. Please contact administrator.',
        hint: 'Set AZURE_STORAGE_CONNECTION_STRING, AZURE_CONTAINER_NAME, and AZURE_STORAGE_ACCOUNT_URL'
      });
    }

    const file = req.file;
    const fieldName = req.body.fieldName || 'file';

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      console.error('❌ File not found on disk:', file.path);
      return res.status(500).json({
        error: 'Upload failed',
        message: 'Uploaded file not found on server'
      });
    }

    let fileUrl: string;

    console.log('☁️ Uploading to Azure Blob Storage...');
    try {
      fileUrl = await uploadToAzure(file.path, file.originalname);
      console.log('✅ Azure upload successful:', fileUrl);
      
      // Clean up temporary local file after successful Azure upload
      try {
        fs.unlinkSync(file.path);
        console.log('🧹 Temporary file cleaned up:', file.path);
      } catch (cleanupError: any) {
        console.warn('⚠️ Failed to cleanup temp file:', cleanupError.message);
        // Don't throw - file was uploaded successfully
      }
    } catch (azureError: any) {
      console.error('❌ Azure upload failed:', azureError);
      // Clean up temp file on failure too
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      throw new Error(`Azure upload failed: ${azureError.message}`);
    }

    console.log('✅ Upload successful');
    res.status(200).json({
      url: fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      fieldName: fieldName
    });
  } catch (error: any) {
    console.error('❌ Error uploading file:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'An error occurred while uploading the file',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    if (isAzureConfigured) {
      return res.status(404).json({
        error: 'File retrieval not available',
        message: 'Direct file retrieval is not supported when using Azure Blob Storage.'
      });
    }

    const uploadsDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    // Set appropriate headers for file viewing/downloading
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

    // Send file
    res.sendFile(filePath);
  } catch (error: any) {
    console.error('Error serving file:', error);
    res.status(500).json({
      error: 'File retrieval failed',
      message: error.message || 'An error occurred while retrieving the file'
    });
  }
};
