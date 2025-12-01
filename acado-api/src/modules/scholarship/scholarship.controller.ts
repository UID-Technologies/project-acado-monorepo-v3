// src/modules/scholarship/scholarship.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ScholarshipService } from './scholarship.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listScholarshipsDto, createScholarshipDto, updateScholarshipDto } from './scholarship.dto.js';

export class ScholarshipController {
  private scholarshipService: ScholarshipService;

  constructor() {
    this.scholarshipService = new ScholarshipService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listScholarshipsDto.parse(req.query);
      const scholarships = await this.scholarshipService.listScholarships(filters);
      res.json(successResponse(scholarships));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scholarship = await this.scholarshipService.getScholarshipById(req.params.id);
      res.json(successResponse(scholarship));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createScholarshipDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const scholarship = await this.scholarshipService.createScholarship(data, userId);
      res.status(201).json(successResponse(scholarship));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateScholarshipDto.parse(req.body);
      const scholarship = await this.scholarshipService.updateScholarship(req.params.id, data);
      res.json(successResponse(scholarship));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scholarship = await this.scholarshipService.deleteScholarship(req.params.id);
      res.json(successResponse({ message: 'Scholarship deleted successfully', scholarship }));
    } catch (error) {
      next(error);
    }
  };

  incrementViews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scholarship = await this.scholarshipService.incrementViews(req.params.id);
      res.json(successResponse(scholarship));
    } catch (error) {
      next(error);
    }
  };

  incrementApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scholarship = await this.scholarshipService.incrementApplications(req.params.id);
      res.json(successResponse(scholarship));
    } catch (error) {
      next(error);
    }
  };
}

export const scholarshipController = new ScholarshipController();

