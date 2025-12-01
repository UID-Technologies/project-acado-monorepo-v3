// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { loadEnv } from '../config/env.js';
import { UserRole } from '../models/User.js';
import User from '../models/User.js';

const { NODE_ENV, JWT_ACCESS_SECRET } = loadEnv();

interface AuthTokenPayload extends JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  role?: UserRole;
  organizationId?: string | null;
  organizationName?: string | null;
  universityIds?: string[];
  courseIds?: string[];
}

type RequestUser = {
  sub: string;
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string | null;
  organizationName?: string | null;
  universityIds?: string[];
  courseIds?: string[];
};

/**
 * Decode and extract user from SSO token without verification
 * For SSO integration where tokens come from external systems
 */
async function decodeSSOToken(token: string): Promise<RequestUser> {
  try {
    // First, try to verify with our secret (for backend-generated tokens)
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as AuthTokenPayload;
    
    console.log('🔍 Decoded token payload:', { 
      sub: decoded.sub, 
      email: decoded.email, 
      role: decoded.role,
      hasRole: !!decoded.role 
    });
    
    if (!decoded?.sub) {
      throw new Error('INVALID_TOKEN_PAYLOAD');
    }

    // If token doesn't have role, fetch from database
    let role = decoded.role;
    if (!role) {
      console.log('⚠️ Token missing role, fetching from database for user:', decoded.sub);
      const user = await User.findOne({ 
        $or: [
          { _id: decoded.sub },
          { email: decoded.email }
        ]
      }).select('role');
      
      if (user) {
        role = user.role;
        console.log('✅ Found role in database:', role);
      } else {
        console.log('⚠️ User not found in database, defaulting to learner');
        role = 'learner';
      }
    }

    return {
      sub: String(decoded.sub),
      id: String(decoded.sub),
      email: decoded.email || 'unknown@example.com',
      name: decoded.name || 'Unknown User',
      role: role as UserRole,
      organizationId: decoded.organizationId || null,
      organizationName: decoded.organizationName || null,
      universityIds: decoded.universityIds || [],
      courseIds: decoded.courseIds || [],
    };
  } catch (verifyError) {
    // If verification fails, decode without verification (SSO tokens)
    // This allows tokens from external systems (eLMS, etc.)
    console.log('⚠️ Token verification failed, attempting SSO decode...');
    
    const decoded = jwt.decode(token) as AuthTokenPayload;
    
    console.log('🔍 SSO token payload:', { 
      sub: decoded?.sub, 
      email: decoded?.email, 
      role: decoded?.role,
      hasRole: !!decoded?.role,
      allFields: Object.keys(decoded || {})
    });
    
    if (!decoded || !decoded.sub) {
      throw new Error('INVALID_SSO_TOKEN');
    }

    // If token doesn't have role, fetch from database
    let role = decoded.role;
    if (!role) {
      console.log('⚠️ SSO token missing role, fetching from database for user:', decoded.sub);
      const user = await User.findOne({ 
        $or: [
          { _id: decoded.sub },
          { email: decoded.email }
        ]
      }).select('role organizationId organizationName universityIds courseIds');
      
      if (user) {
        role = user.role;
        console.log('✅ Found user in database:', { 
          role: user.role, 
          organizationId: user.organizationId,
          email: user.email 
        });
        
        // Also populate other fields from database if not in token
        return {
          sub: String(decoded.sub),
          id: String(decoded.sub),
          email: decoded.email || user.email || 'sso@example.com',
          name: decoded.name || user.name || 'SSO User',
          role: user.role as UserRole,
          organizationId: decoded.organizationId || (user.organizationId ? String(user.organizationId) : null),
          organizationName: decoded.organizationName || user.organizationName || null,
          universityIds: decoded.universityIds || (user.universityIds ? user.universityIds.map(id => String(id)) : []),
          courseIds: decoded.courseIds || (user.courseIds ? user.courseIds.map(id => String(id)) : []),
        };
      } else {
        console.log('⚠️ User not found in database, defaulting to learner');
        role = 'learner';
      }
    }

    // Map SSO token to our user structure
    return {
      sub: String(decoded.sub),
      id: String(decoded.sub),
      email: decoded.email || 'sso@example.com',
      name: decoded.name || 'SSO User',
      role: role as UserRole,
      organizationId: decoded.organizationId || null,
      organizationName: decoded.organizationName || null,
      universityIds: decoded.universityIds || [],
      courseIds: decoded.courseIds || [],
    };
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    console.log('❌ No Bearer token provided');
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  try {
    const token = h.split(' ')[1];
    console.log('🔑 Authenticating request with token...');
    
    const requestUser = await decodeSSOToken(token);
    (req as any).user = requestUser;
    
    console.log('✅ User authenticated:', { email: requestUser.email, role: requestUser.role });
    return next();
  } catch (error) {
    if (NODE_ENV !== 'production') {
      console.error('❌ Auth error:', error);
    }
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return next();

  try {
    const token = h.split(' ')[1];
    const requestUser = await decodeSSOToken(token);
    (req as any).user = requestUser;
  } catch {
    // Ignore invalid tokens for optional auth paths
  }
  next();
}
