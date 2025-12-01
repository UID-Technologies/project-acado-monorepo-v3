// src/modules/event/event.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Event from '../../models/Event.js';
import { Document } from 'mongoose';
import { Event as IEvent } from '../../models/Event.js';

export type EventDocument = Document<unknown, {}, IEvent> & IEvent;

export class EventRepository extends BaseRepository<EventDocument> {
  constructor() {
    super(Event as any);
  }

  async findByStatus(status: string): Promise<EventDocument[]> {
    return this.find({ status } as any);
  }

  async findByMode(mode: string): Promise<EventDocument[]> {
    return this.find({ mode } as any);
  }

  async findPopular(): Promise<EventDocument[]> {
    return this.find({ isPopular: true } as any);
  }

  async findActive(): Promise<EventDocument[]> {
    return this.find({ status: 'active' } as any);
  }
}

