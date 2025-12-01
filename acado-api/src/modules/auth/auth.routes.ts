// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import {
  registerDto,
  loginDto,
  changePasswordDto,
  updateProfileDto,
  forgotPasswordDto,
  resetPasswordDto,
} from './auth.dto.js';
import { authRateLimiter } from '../../core/middleware/rateLimiter.js';

const router = Router();

// Public routes (no auth required)
router.post('/register', authRateLimiter, validateRequest(registerDto, 'body'), authController.register);
router.post('/login', authRateLimiter, validateRequest(loginDto, 'body'), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authRateLimiter, validateRequest(forgotPasswordDto, 'body'), authController.forgotPassword);
router.post('/reset-password', authRateLimiter, validateRequest(resetPasswordDto, 'body'), authController.resetPassword);

// Protected routes (auth required)
router.get('/profile', requireAuth, authController.getProfile);
router.put('/profile', requireAuth, validateRequest(updateProfileDto, 'body'), authController.updateProfile);
router.post('/change-password', requireAuth, validateRequest(changePasswordDto, 'body'), authController.changePassword);

export default router;

