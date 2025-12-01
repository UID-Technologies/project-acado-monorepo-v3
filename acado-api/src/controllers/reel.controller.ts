// src/controllers/reel.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/reel.service.js';

export async function list(req: Request, res: Response) {
  try {
    const { status, visibility, category, search } = req.query;
    const filters: any = {};
    if (status) filters.status = status as string;
    if (visibility) filters.visibility = visibility as string;
    if (category) filters.category = category as string;
    if (search) filters.search = search as string;
    
    const reels = await service.listReels(filters);
    res.json(reels);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const reel = await service.getReelById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const reel = await service.createReel(req.body, userId);
    res.status(201).json(reel);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const reel = await service.updateReel(req.params.id, req.body);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const reel = await service.deleteReel(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json({ message: 'Reel deleted successfully', reel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function incrementViews(req: Request, res: Response) {
  try {
    const reel = await service.incrementViews(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function incrementLikes(req: Request, res: Response) {
  try {
    const reel = await service.incrementLikes(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });
    res.json(reel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

