// src/modules/event/event.service.ts
import { Types } from 'mongoose';
import { EventRepository } from './event.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateEventDto,
  UpdateEventDto,
  ListEventsDto,
} from './event.dto.js';

export class EventService {
  private eventRepo: EventRepository;

  constructor() {
    this.eventRepo = new EventRepository();
  }

  async listEvents(filters: ListEventsDto = {}) {
    // Use existing service for complex filtering
    const { listEvents: listEventsService } = await import('../../services/event.service.js');
    return listEventsService(filters);
  }

  async getEventById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid event ID');
    }

    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    return event.toJSON();
  }

  async createEvent(data: CreateEventDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const { createEvent: createEventService } = await import('../../services/event.service.js');
    return createEventService(data, userId);
  }

  async updateEvent(id: string, data: UpdateEventDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid event ID');
    }

    const { updateEvent: updateEventService } = await import('../../services/event.service.js');
    return updateEventService(id, data);
  }

  async deleteEvent(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid event ID');
    }

    const { deleteEvent: deleteEventService } = await import('../../services/event.service.js');
    return deleteEventService(id);
  }

  async incrementViews(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid event ID');
    }

    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const updated = await this.eventRepo.update(id, {
      views: ((event.toJSON() as any).views || 0) + 1,
    } as any);
    return updated?.toJSON();
  }

  async incrementRegistrations(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid event ID');
    }

    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const updated = await this.eventRepo.update(id, {
      registrations: ((event.toJSON() as any).registrations || 0) + 1,
    } as any);
    return updated?.toJSON();
  }
}

