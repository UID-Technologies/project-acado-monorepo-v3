// src/middleware/rbac.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.js';

export function permit(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role;
    console.log('🔐 RBAC Check:', { 
      userRole: role, 
      allowedRoles: roles, 
      hasAccess: role && roles.includes(role),
      userEmail: (req as any).user?.email 
    });
    if (!role || !roles.includes(role)) {
      console.log('❌ Access denied - role mismatch');
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    console.log('✅ Access granted');
    next();
  };
}
