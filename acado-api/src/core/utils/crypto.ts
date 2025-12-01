// src/core/utils/crypto.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a random token
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 16): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

/**
 * Hash a string using SHA256
 */
export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

