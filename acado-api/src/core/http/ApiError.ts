// src/core/http/ApiError.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errorCode?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(404, message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(409, message, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(500, message, 'INTERNAL_ERROR', details);
    this.name = 'InternalServerError';
  }
}

