// src/modules/wallPost/wallPost.dto.ts
import { z } from 'zod';

export const createWallPostDto = z.object({
  description: z.string().min(1, 'Description is required'),
  media: z.string().url().optional(),
  mediaType: z.enum(['image', 'video']).optional(),
});

export const updateWallPostDto = createWallPostDto.partial();

export const listWallPostsDto = z.object({
  createdBy: z.string().optional(),
  search: z.string().optional(),
});

export type CreateWallPostDto = z.infer<typeof createWallPostDto>;
export type UpdateWallPostDto = z.infer<typeof updateWallPostDto>;
export type ListWallPostsDto = z.infer<typeof listWallPostsDto>;

