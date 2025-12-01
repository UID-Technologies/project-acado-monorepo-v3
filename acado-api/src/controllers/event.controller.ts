// src/controllers/event.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/event.service.js';

export async function list(req: Request, res: Response) {
  try {
    const { status, mode, difficultyLevel, subscriptionType, isPopular, search } = req.query;
    const filters: any = {};
    if (status) filters.status = status as string;
    if (mode) filters.mode = mode as string;
    if (difficultyLevel) filters.difficultyLevel = difficultyLevel as string;
    if (subscriptionType) filters.subscriptionType = subscriptionType as string;
    if (isPopular !== undefined) filters.isPopular = isPopular === 'true';
    if (search) filters.search = search as string;
    
    const events = await service.listEvents(filters);
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const event = await service.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const event = await service.createEvent(req.body, userId);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const event = await service.updateEvent(req.params.id, req.body);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const event = await service.deleteEvent(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully', event });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function incrementViews(req: Request, res: Response) {
  try {
    const event = await service.incrementViews(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function incrementRegistrations(req: Request, res: Response) {
  try {
    const event = await service.incrementRegistrations(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

