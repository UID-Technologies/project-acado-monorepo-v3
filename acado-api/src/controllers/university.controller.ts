// src/controllers/university.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/university.service.js';
import * as courseService from '../services/course.service.js';

export async function list(req: Request, res: Response) {
  try {
    const {
      search,
      country,
      institutionType,
      parentInstitutionId,
      status,
      isActive,
      page,
      pageSize,
      organizationId,
    } = req.query;

    const filters = {
      search: search as string | undefined,
      country: country as string | undefined,
      institutionType: institutionType as string | undefined,
      parentInstitutionId: parentInstitutionId as string | undefined,
      status:
        typeof status === 'string' && ['Active', 'Suspended'].includes(status)
        ? (status as 'Active' | 'Suspended')
        : undefined,
      isActive: typeof isActive === 'string' ? isActive === 'true' : undefined,
      organizationId: organizationId as string | undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    };

    const universities = await service.listUniversities(filters);
    res.json(universities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const university = await service.getUniversityById(req.params.id);
    if (!university) return res.status(404).json({ error: 'University not found' });
    res.json(university);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const university = await service.createUniversity(req.body, userId);
    res.status(201).json(university);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const university = await service.updateUniversity(req.params.id, req.body);
    if (!university) return res.status(404).json({ error: 'University not found' });
    res.json(university);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const deleted = await service.deleteUniversity(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'University not found' });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    const courses = await courseService.getCoursesByUniversityId(req.params.id);
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getStats(_req: Request, res: Response) {
  try {
    const stats = await service.getUniversityStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

