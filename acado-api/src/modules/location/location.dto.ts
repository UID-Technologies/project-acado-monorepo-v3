// src/modules/location/location.dto.ts
import { z } from 'zod';

export const statesQueryDto = z.object({
  country: z.string().min(1, 'Country is required'),
});

export const citiesQueryDto = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
});

export type StatesQueryDto = z.infer<typeof statesQueryDto>;
export type CitiesQueryDto = z.infer<typeof citiesQueryDto>;

