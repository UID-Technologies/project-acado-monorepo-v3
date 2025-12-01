// src/routes/auth.routes.ts
import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { z } from 'zod';

const r = Router();

// Validation schemas
const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid identifier');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(50).optional(),
    organizationId: objectIdSchema,
    universityId: objectIdSchema,
    courseIds: z.array(objectIdSchema).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters')
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional()
  })
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format')
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

// Public routes (no auth required)
r.post('/register', validate(registerSchema), ctrl.register);
r.post('/login', validate(loginSchema), ctrl.login);
r.post('/refresh', ctrl.refreshToken);
r.post('/logout', ctrl.logout);
r.post('/forgot-password', validate(forgotPasswordSchema), ctrl.forgotPassword);
r.post('/reset-password', validate(resetPasswordSchema), ctrl.resetPassword);

// Protected routes (auth required)
r.get('/profile', requireAuth, ctrl.getProfile);
r.put('/profile', requireAuth, validate(updateProfileSchema), ctrl.updateProfile);
r.post('/change-password', requireAuth, validate(changePasswordSchema), ctrl.changePassword);

export default r;

