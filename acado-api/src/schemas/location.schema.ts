// src/schemas/location.schema.ts
import { z } from 'zod';

const nonEmptyString = (field: string) =>
  z
    .string({
      required_error: `${field} is required`,
      invalid_type_error: `${field} must be a string`,
    })
    .trim()
    .min(1, `${field} is required`);

export const statesQuerySchema = z.object({
  query: z.object({
    country: nonEmptyString('country'),
  }),
});

export const citiesQuerySchema = z.object({
  query: z.object({
    country: nonEmptyString('country'),
    state: nonEmptyString('state'),
  }),
});


