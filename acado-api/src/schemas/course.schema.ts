// src/schemas/course.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

const optionalDate = z
  .string()
  .min(1)
  .transform((value) => new Date(value))
  .refine((date) => !Number.isNaN(date.getTime()), { message: 'Invalid date' })
  .optional();

const campaignSchema = z
  .object({
    modeOfDelivery: z.string().max(256).optional(),
    aboutCourse: z.string().max(5000).optional(),
    whatWillYouGet: z.string().max(5000).optional(),
    brochure: z.string().max(1024).optional(),
    eligibility: z.string().max(2000).optional(),
    fieldOfStudy: z.string().max(512).optional(),
    duration: z.string().max(128).optional(),
    noOfPeopleRated: z.string().max(64).optional(),
    rating: z.string().max(32).optional(),
    department: z.string().max(256).optional(),
    tuitionFee: z.string().max(128).optional(),
    credits: z.string().max(64).optional(),
    maximumSeats: z.string().max(64).optional(),
    availableSeats: z.string().max(64).optional(),
    preRequisites: z.string().max(2000).optional(),
    classSlots: z.string().max(512).optional(),
    language: z.string().max(128).optional(),
    scholarship: z.string().max(1024).optional(),
    howToApply: z.string().max(5000).optional(),
    courseStructure: z.string().max(5000).optional(),
    learningOutcome: z.string().max(5000).optional(),
    partners: z.string().max(1024).optional(),
    collaboration: z.string().max(1024).optional(),
    careerOpportunities: z.string().max(5000).optional(),
    courseUSP: z.string().max(2000).optional(),
  })
  .partial();

const baseSchema = z.object({
  universityId: objectId,
  name: z.string().min(2).max(256),
  shortName: z.string().min(2).max(64),
  courseCode: z.string().max(64).optional(),
  description: z.string().min(10),
  keywords: z.string().max(512).optional(),
  courseCategoryId: objectId.optional(),
  courseTypeId: objectId.optional(),
  courseLevelId: objectId.optional(),
  duration: z.string().max(128).optional(),
  requirements: z.string().max(1024).optional(),
  fee: z.number().nonnegative().optional(),
  currency: z.string().max(8).optional(),
  thumbnail: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  learningOutcomeIds: z.array(objectId).optional(),
  startDate: optionalDate,
  endDate: optionalDate,
  applicationDeadline: optionalDate,
  isActive: z.boolean().optional(),
  campaign: campaignSchema.optional(),
});

export const createCourseSchema = z.object({
  body: baseSchema.transform((data) => ({
    ...data,
    isActive: data.isActive ?? true,
  })),
});

export const updateCourseSchema = z.object({
  params: z.object({ id: objectId }),
  body: baseSchema.partial(),
});

export const courseIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});


