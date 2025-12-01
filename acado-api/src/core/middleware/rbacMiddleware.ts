// src/core/middleware/rbacMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../models/User.js';
import { ForbiddenError } from '../http/ApiError.js';

export function permit(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role;
    
    if (!role || !roles.includes(role)) {
      return next(new ForbiddenError(`Access denied. Required roles: ${roles.join(', ')}`));
    }
    
    next();
  };
}

