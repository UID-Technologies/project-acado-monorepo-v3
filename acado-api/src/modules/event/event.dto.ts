// src/modules/event/event.dto.ts
import { z } from 'zod';

export const eventStageDto = z.object({
  type: z.enum(['assessment', 'submission', 'video', 'notes', 'live_session']),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
  status: z.enum(['draft', 'ready']).optional(),
  resourceId: z.string().optional(),
  duration: z.number().int().positive().optional(),
  points: z.number().int().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const eligibilityDto = z.object({
  type: z.enum(['everyone', 'students', 'professionals', 'custom']),
  colleges: z.array(z.string()).optional(),
  organizations: z.array(z.string()).optional(),
  genderRestriction: z.enum(['all', 'male', 'female', 'other']).optional(),
});

export const registrationSettingsDto = z.object({
  approval: z.enum(['auto', 'manual']),
  maxSeats: z.number().int().positive().optional(),
  enableWaitlist: z.boolean().optional(),
  cutoffLogic: z.string().optional(),
  eventFee: z.number().nonnegative().optional(),
});

export const createEventDto = z.object({
  logo: z.string().url().optional(),
  title: z.string().min(1, 'Title is required'),
  categoryTags: z.array(z.string()).optional(),
  conductedBy: z.string().min(1),
  functionalDomain: z.string().optional(),
  jobRole: z.string().optional(),
  skills: z.array(z.string()).optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  subscriptionType: z.enum(['free', 'paid']),
  isPopular: z.boolean().optional(),
  description: z.string().min(1),
  whatsInItForYou: z.string().optional(),
  instructions: z.string().optional(),
  faq: z.string().optional(),
  registrationStartDate: z.coerce.date(),
  registrationEndDate: z.coerce.date(),
  eventDate: z.coerce.date(),
  eventTime: z.string().optional(),
  mode: z.enum(['online', 'offline', 'hybrid']),
  venue: z.string().optional(),
  expertId: z.string().optional(),
  expertName: z.string().optional(),
  additionalInfo: z.string().optional(),
  eligibility: eligibilityDto,
  registrationSettings: registrationSettingsDto,
  stages: z.array(eventStageDto).optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).optional(),
}).passthrough();

export const updateEventDto = createEventDto.partial();

export const listEventsDto = z.object({
  status: z.string().optional(),
  mode: z.string().optional(),
  difficultyLevel: z.string().optional(),
  subscriptionType: z.string().optional(),
  isPopular: z.boolean().optional(),
  search: z.string().optional(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;
export type UpdateEventDto = z.infer<typeof updateEventDto>;
export type ListEventsDto = z.infer<typeof listEventsDto>;

