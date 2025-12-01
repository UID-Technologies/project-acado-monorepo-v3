// src/modules/communityPost/communityPost.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const createCategoryDto = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().optional(),
});

export const updateCategoryDto = createCategoryDto.partial();

export const createCommunityPostDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  contentType: z.enum(['images', 'notes', 'videos']),
  categoryId: objectIdSchema,
  thumbnail: z.string().url().optional(),
  media: z.string().optional(),
  isPinned: z.boolean().optional(),
  translations: z.record(z.object({
    title: z.string(),
    description: z.string(),
  })).optional(),
});

export const updateCommunityPostDto = createCommunityPostDto.partial();

export const listCommunityPostsDto = z.object({
  categoryId: z.string().optional(),
  contentType: z.string().optional(),
  isPinned: z.boolean().optional(),
  search: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
export type CreateCommunityPostDto = z.infer<typeof createCommunityPostDto>;
export type UpdateCommunityPostDto = z.infer<typeof updateCommunityPostDto>;
export type ListCommunityPostsDto = z.infer<typeof listCommunityPostsDto>;

