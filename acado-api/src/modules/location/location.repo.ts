// src/modules/location/location.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Location, { LocationDocument } from './location.model.js';

export class LocationRepository extends BaseRepository<LocationDocument> {
  constructor() {
    super(Location as any);
  }
}

