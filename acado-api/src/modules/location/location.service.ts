// src/modules/location/location.service.ts
import Location, { LocationDocument } from './location.model.js';
import { ValidationError } from '../../core/http/ApiError.js';

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeMatch = (field: string, value: string) => ({
  [field]: { $regex: `^${escapeRegex(value.trim())}$`, $options: 'i' },
});

const sanitize = (value: any) => (typeof value === 'string' ? value.trim() : '');

export class LocationService {
  async listCountries(): Promise<string[]> {
    const results = await Location.aggregate<{ name: string }>([
      {
        $match: {
          country: { $nin: [null, ''] },
        },
      },
      { $sort: { country: 1 } },
      {
        $group: {
          _id: { $toUpper: '$country' },
          name: { $first: '$country' },
        },
      },
      { $sort: { name: 1 } },
    ]);

    return results.map((doc) => sanitize(doc.name)).filter(Boolean);
  }

  async listStates(country: string): Promise<string[]> {
    if (!country?.trim()) {
      throw new ValidationError('Country is required');
    }

    const results = await Location.aggregate<{ name: string }>([
      { $match: { ...normalizeMatch('country', country), state: { $nin: [null, ''] } } },
      { $sort: { state: 1 } },
      {
        $group: {
          _id: { $toUpper: '$state' },
          name: { $first: '$state' },
        },
      },
      { $sort: { name: 1 } },
    ]);

    return results.map((doc) => sanitize(doc.name)).filter(Boolean);
  }

  async listCities(country: string, state: string): Promise<string[]> {
    if (!country?.trim()) {
      throw new ValidationError('Country is required');
    }
    if (!state?.trim()) {
      throw new ValidationError('State is required');
    }

    const results = await Location.aggregate<{ name: string }>([
      {
        $match: {
          ...normalizeMatch('country', country),
          ...normalizeMatch('state', state),
          city: { $nin: [null, ''] },
        },
      },
      { $sort: { city: 1 } },
      {
        $group: {
          _id: { $toUpper: '$city' },
          name: { $first: '$city' },
        },
      },
      { $sort: { name: 1 } },
    ]);

    return results.map((doc) => sanitize(doc.name)).filter(Boolean);
  }
}

