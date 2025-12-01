// src/modules/auth/auth.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const registerDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50).optional(),
  organizationId: objectIdSchema,
  universityId: objectIdSchema,
  courseIds: z.array(objectIdSchema).optional(),
});

export const loginDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordDto = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const updateProfileDto = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const forgotPasswordDto = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordDto = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
export type ChangePasswordDto = z.infer<typeof changePasswordDto>;
export type UpdateProfileDto = z.infer<typeof updateProfileDto>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;

