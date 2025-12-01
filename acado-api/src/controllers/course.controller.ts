// src/controllers/course.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/course.service.js';

export async function list(req: Request, res: Response) {
  try {
    const { universityId, type, level, isActive, courseCategoryId, courseTypeId, courseLevelId } = req.query;
    const filters: any = {};
    if (universityId) filters.universityId = universityId;
    if (type) filters.type = type;
    if (level) filters.level = level;
    if (courseCategoryId) filters.courseCategoryId = courseCategoryId;
    if (courseTypeId) filters.courseTypeId = courseTypeId;
    if (courseLevelId) filters.courseLevelId = courseLevelId;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    const courses = await service.listCourses(filters);
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const course = await service.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const course = await service.createCourse(req.body, userId);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const course = await service.updateCourse(req.params.id, req.body);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const deleted = await service.deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

