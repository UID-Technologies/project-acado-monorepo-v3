// src/core/middleware/universityScopeMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../http/ApiError.js';

/**
 * Middleware that automatically applies university filtering for admin users
 * Admin users can only access data from their assigned universities
 * Superadmin users have access to all data
 */
export function scopeByUniversity(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  // If no user (public access), allow through without filtering
  if (!user) {
    return next();
  }

  // Superadmin has access to all universities - no filtering needed
  if (user.role === 'superadmin') {
    return next();
  }

  // Admin role - restrict to their assigned universities
  if (user.role === 'admin') {
    const universityIds = user.universityIds || [];
    
    if (universityIds.length === 0) {
      return next(new ForbiddenError('Admin user has no assigned universities'));
    }

    // If universityId is already specified in query, validate it
    if (req.query.universityId) {
      const requestedUniversityId = req.query.universityId as string;
      
      if (!universityIds.includes(requestedUniversityId)) {
        return next(new ForbiddenError('Access denied to this university'));
      }
    } else {
      // Auto-inject the first university ID if not specified
      // Admin typically manages one university
      req.query.universityId = universityIds[0];
    }
  }

  // Learner role - restrict to their assigned universities (courses, applications)
  if (user.role === 'learner') {
    const universityIds = user.universityIds || [];
    
    if (universityIds.length > 0 && !req.query.universityId) {
      // For learners accessing their own data
      // They can see content from universities they're enrolled in
      (req as any).userUniversityIds = universityIds;
    }
  }

  next();
}

/**
 * Middleware to validate university access for specific resource operations
 * Used for create/update/delete operations
 */
export function validateUniversityAccess(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user) {
    return next(new UnauthorizedError());
  }

  // Superadmin can access all
  if (user.role === 'superadmin') {
    return next();
  }

  // Admin can only modify their university's data
  if (user.role === 'admin') {
    const universityIds = user.universityIds || [];
    const resourceUniversityId = req.body.universityId || req.params.universityId;
    
    if (!resourceUniversityId) {
      return next(new ForbiddenError('universityId is required'));
    }

    if (!universityIds.includes(resourceUniversityId)) {
      return next(new ForbiddenError('Cannot modify data for this university'));
    }
  }

  next();
}

/**
 * Middleware to ensure user has access to the requested university
 */
export function requireUniversityAccess(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  const universityId = req.params.universityId || req.body.universityId || req.query.universityId;

  if (!user) {
    return next(new UnauthorizedError());
  }

  // Superadmin and admin have access to all universities
  if (user.role === 'superadmin' || user.role === 'admin') {
    return next();
  }

  // Check if user has access to this university
  if (universityId && user.universityIds && user.universityIds.includes(universityId)) {
    return next();
  }

  return next(new ForbiddenError('Access denied to this university'));
}

