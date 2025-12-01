// src/core/utils/validator.ts
import { z } from 'zod';

/**
 * Validate MongoDB ObjectId format
 */
export const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ObjectId format');

/**
 * Validate email format
 */
export const emailSchema = z.string().email('Invalid email format');

/**
 * Validate password strength
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters');

/**
 * Validate pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
});

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validate and sanitize object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  schema: z.ZodSchema<T>
): T {
  return schema.parse(obj);
}

