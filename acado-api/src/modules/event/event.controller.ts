// src/modules/event/event.controller.ts
import { Request, Response, NextFunction } from 'express';
import { EventService } from './event.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listEventsDto, createEventDto, updateEventDto } from './event.dto.js';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listEventsDto.parse(req.query);
      const events = await this.eventService.listEvents(filters);
      res.json(successResponse(events));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      res.json(successResponse(event));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createEventDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const event = await this.eventService.createEvent(data, userId);
      res.status(201).json(successResponse(event));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateEventDto.parse(req.body);
      const event = await this.eventService.updateEvent(req.params.id, data);
      res.json(successResponse(event));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.deleteEvent(req.params.id);
      res.json(successResponse({ message: 'Event deleted successfully', event }));
    } catch (error) {
      next(error);
    }
  };

  incrementViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.incrementViews(req.params.id);
      res.json(successResponse(event));
    } catch (error) {
      next(error);
    }
  };

  incrementRegistrations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.incrementRegistrations(req.params.id);
      res.json(successResponse(event));
    } catch (error) {
      next(error);
    }
  };
}

export const eventController = new EventController();

