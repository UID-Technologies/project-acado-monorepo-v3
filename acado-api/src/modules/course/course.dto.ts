// src/modules/course/course.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const courseCampaignDto = z.object({
  modeOfDelivery: z.string().optional(),
  aboutCourse: z.string().optional(),
  whatWillYouGet: z.string().optional(),
  brochure: z.string().optional(),
  eligibility: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  duration: z.string().optional(),
  noOfPeopleRated: z.string().optional(),
  rating: z.string().optional(),
  department: z.string().optional(),
  tuitionFee: z.string().optional(),
  credits: z.string().optional(),
  maximumSeats: z.string().optional(),
  availableSeats: z.string().optional(),
  preRequisites: z.string().optional(),
  classSlots: z.string().optional(),
  language: z.string().optional(),
  scholarship: z.string().optional(),
  howToApply: z.string().optional(),
  courseStructure: z.string().optional(),
  learningOutcome: z.string().optional(),
  partners: z.string().optional(),
  collaboration: z.string().optional(),
  careerOpportunities: z.string().optional(),
  courseUSP: z.string().optional(),
}).passthrough();

export const createCourseDto = z.object({
  universityId: objectIdSchema,
  universityName: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  courseCode: z.string().optional(),
  type: z.enum(['degree', 'exchange', 'pathway', 'diploma', 'certification']).optional(),
  typeId: objectIdSchema.optional(),
  level: z.enum(['undergraduate', 'postgraduate', 'doctoral']).optional(),
  levelId: objectIdSchema.optional(),
  categoryId: objectIdSchema.optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  thumbnail: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  requirements: z.string().optional(),
  fee: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  applicationDeadline: z.coerce.date().optional(),
  applicationFormId: objectIdSchema.optional(),
  learningOutcomeIds: z.array(objectIdSchema).optional(),
  isActive: z.boolean().optional(),
  campaign: courseCampaignDto.optional(),
}).passthrough();

export const updateCourseDto = createCourseDto.partial();

export const listCoursesDto = z.object({
  universityId: z.string().optional(),
  type: z.string().optional(),
  level: z.string().optional(),
  typeId: z.string().optional(),
  levelId: z.string().optional(),
  categoryId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateCourseDto = z.infer<typeof createCourseDto>;
export type UpdateCourseDto = z.infer<typeof updateCourseDto>;
export type ListCoursesDto = z.infer<typeof listCoursesDto>;

