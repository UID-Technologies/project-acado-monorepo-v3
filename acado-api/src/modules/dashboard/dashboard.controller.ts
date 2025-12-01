// src/modules/dashboard/dashboard.controller.ts
import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getStats();
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();

