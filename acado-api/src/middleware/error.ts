// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Not Found'));
};

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!(err instanceof ApiError)) {
    const status = err.message?.endsWith('_NOT_FOUND') ? 404 : 400;
    return next(new ApiError(status, err.message || 'Internal Error'));
  }
  next(err);
};

export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  const payload: any = {
    error: err.message || 'INTERNAL_ERROR',
    requestId: (req as any).id
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) payload.stack = err.stack;
  logger.error({ err, path: req.path, method: req.method, requestId: (req as any).id });
  res.status(status).json(payload);
};
