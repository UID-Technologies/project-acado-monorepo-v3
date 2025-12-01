// src/modules/upload/upload.controller.ts
import { Request, Response, NextFunction } from 'express';
import { uploadService } from './upload.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { ApiError } from '../../core/http/ApiError.js';
import path from 'path';

export class UploadController {
  uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(new ApiError(400, 'No file uploaded', 'NO_FILE'));
      }

      const fieldName = req.body.fieldName || 'file';
      const result = await uploadService.uploadFile(req.file, fieldName);
      res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  getFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;
      const { filePath, contentType } = await uploadService.getFile(filename);

      // Set appropriate headers for file viewing/downloading
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

      // Send file
      res.sendFile(filePath);
    } catch (error) {
      next(error);
    }
  };
}

export const uploadController = new UploadController();

