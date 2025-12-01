// src/core/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../http/ApiError.js';
import { logger } from '../../config/logger.js';
import { errorResponse } from '../http/ApiResponse.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`, 'NOT_FOUND'));
};

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return next(err);
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const details = err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', details));
  }

  // Handle Mongoose errors
  if (err.name === 'CastError') {
    return next(new ApiError(400, 'Invalid ID format', 'INVALID_ID'));
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', details));
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return next(new ApiError(409, `${field} already exists`, 'DUPLICATE_ENTRY'));
  }

  // Default to 500 error
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  return next(new ApiError(status, message, 'INTERNAL_ERROR'));
};

export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  const requestId = (req as any).id;

  // Log error
  logger.error({
    err,
    path: req.path,
    method: req.method,
    requestId,
    statusCode: status,
  });

  // Send error response
  res.status(status).json(
    errorResponse({
      code: err.errorCode || 'INTERNAL_ERROR',
      message: err.message,
      details: process.env.NODE_ENV !== 'production' ? err.details : undefined,
    })
  );
};

