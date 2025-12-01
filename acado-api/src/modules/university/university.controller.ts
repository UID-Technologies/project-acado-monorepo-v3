// src/modules/university/university.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UniversityService } from './university.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listUniversitiesDto, createUniversityDto, updateUniversityDto } from './university.dto.js';

export class UniversityController {
  private universityService: UniversityService;

  constructor() {
    this.universityService = new UniversityService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listUniversitiesDto.parse(req.query);
      const universities = await this.universityService.listUniversities(filters);
      res.json(successResponse(universities));
    } catch (error: any) {
      // Log error for debugging
      console.error('University list error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        errors: error?.errors,
        query: req.query,
      });
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const university = await this.universityService.getUniversityById(req.params.id);
      res.json(successResponse(university));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createUniversityDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const university = await this.universityService.createUniversity(data, userId);
      res.status(201).json(successResponse(university));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateUniversityDto.parse(req.body);
      const university = await this.universityService.updateUniversity(req.params.id, data);
      res.json(successResponse(university));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.universityService.deleteUniversity(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await this.universityService.getCourses(req.params.id);
      res.json(successResponse(courses));
    } catch (error) {
      next(error);
    }
  };

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.universityService.getUniversityStats();
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  };
}

export const universityController = new UniversityController();

