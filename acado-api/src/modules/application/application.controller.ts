// src/modules/application/application.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from './application.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { queryApplicationsDto, createApplicationDto, updateApplicationDto, reviewApplicationDto } from './application.dto.js';

export class ApplicationController {
  private applicationService: ApplicationService;

  constructor() {
    this.applicationService = new ApplicationService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = queryApplicationsDto.parse(req.query);
      const result = await this.applicationService.listApplications(query);
      // Handle both old format (with applications/data/items) and new format (array)
      const applications = Array.isArray(result) 
        ? result 
        : ((result as any).applications || (result as any).data || (result as any).items || []);
      res.json(successResponse(applications));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enrich = req.query.enrich !== 'false';
      const application = await this.applicationService.getApplicationById(req.params.id, enrich);
      res.json(successResponse(application));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createApplicationDto.parse(req.body);
      const metadata = {
        ipAddress: req.ip || (req as any).connection?.remoteAddress,
        userAgent: req.get('user-agent'),
      };
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const application = await this.applicationService.createApplication(
        { ...data, metadata },
        userId
      );
      res.status(201).json(successResponse(application));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateApplicationDto.parse(req.body);
      const application = await this.applicationService.updateApplication(req.params.id, data);
      res.json(successResponse(application));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.applicationService.deleteApplication(req.params.id);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const application = await this.applicationService.submitApplication(req.params.id);
      res.json(successResponse(application));
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const application = await this.applicationService.withdrawApplication(req.params.id);
      res.json(successResponse(application));
    } catch (error) {
      next(error);
    }
  };

  review = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = reviewApplicationDto.parse(req.body);
      const reviewerId = (req as any).user?.sub || (req as any).user?.id;
      const application = await this.applicationService.reviewApplication(req.params.id, data, reviewerId);
      res.json(successResponse(application));
    } catch (error) {
      next(error);
    }
  };

  stats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.applicationService.getApplicationStats(req.query);
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  };
}

export const applicationController = new ApplicationController();

