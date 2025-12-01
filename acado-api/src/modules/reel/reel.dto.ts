// src/modules/reel/reel.dto.ts
import { z } from 'zod';

export const createReelDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  videoUrl: z.string().url('Invalid video URL'),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().int().positive('Duration must be positive'),
  captionUrl: z.string().url().optional(),
  language: z.string().optional(),
  visibility: z.enum(['public', 'organization', 'private']).optional(),
  status: z.enum(['draft', 'active', 'inactive']).optional(),
  scheduledPublishAt: z.coerce.date().optional(),
});

export const updateReelDto = createReelDto.partial();

export const listReelsDto = z.object({
  status: z.string().optional(),
  visibility: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export type CreateReelDto = z.infer<typeof createReelDto>;
export type UpdateReelDto = z.infer<typeof updateReelDto>;
export type ListReelsDto = z.infer<typeof listReelsDto>;

