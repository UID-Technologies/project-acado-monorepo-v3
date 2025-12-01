// src/controllers/scholarship.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/scholarship.service.js';

export async function list(req: Request, res: Response) {
  try {
    const { status, visibility, type, studyLevel, search } = req.query;
    const filters: any = {};
    if (status) filters.status = status as string;
    if (visibility) filters.visibility = visibility as string;
    if (type) filters.type = type as string;
    if (studyLevel) filters.studyLevel = studyLevel as string;
    if (search) filters.search = search as string;
    
    const scholarships = await service.listScholarships(filters);
    res.json(scholarships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const scholarship = await service.getScholarshipById(req.params.id);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });
    res.json(scholarship);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const scholarship = await service.createScholarship(req.body, userId);
    res.status(201).json(scholarship);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const scholarship = await service.updateScholarship(req.params.id, req.body);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });
    res.json(scholarship);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const scholarship = await service.deleteScholarship(req.params.id);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });
    res.json({ message: 'Scholarship deleted successfully', scholarship });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function incrementViews(req: Request, res: Response) {
  try {
    const scholarship = await service.incrementViews(req.params.id);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });
    res.json(scholarship);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function incrementApplications(req: Request, res: Response) {
  try {
    const scholarship = await service.incrementApplications(req.params.id);
    if (!scholarship) return res.status(404).json({ error: 'Scholarship not found' });
    res.json(scholarship);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

