// src/modules/user/user.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const createUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  userType: z.enum(['Learner', 'Faculty', 'Staff', 'Admin']).optional(),
  role: z.enum(['superadmin', 'admin', 'learner']).optional(),
  organizationId: objectIdSchema.optional().nullable(),
  organizationName: z.string().optional(),
  universityId: objectIdSchema.optional().nullable(),
  universityName: z.string().optional(),
  mobileNo: z.string().optional(),
  studentIdStaffId: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
}).passthrough();

export const updateUserDto = createUserDto.partial().extend({
  password: z.string().min(8).optional(),
});

export const listUsersDto = z.object({
  search: z.string().optional(),
  userType: z.enum(['Learner', 'Faculty', 'Staff', 'Admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  universityId: z.string().optional(),
  universityName: z.string().optional(),
});

export const bulkCreateUsersDto = z.object({
  users: z.array(createUserDto).min(1, 'At least one user is required'),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
export type UpdateUserDto = z.infer<typeof updateUserDto>;
export type ListUsersDto = z.infer<typeof listUsersDto>;
export type BulkCreateUsersDto = z.infer<typeof bulkCreateUsersDto>;

