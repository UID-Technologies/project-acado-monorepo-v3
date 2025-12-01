// src/modules/courseLevel/courseLevel.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CourseLevelService } from './courseLevel.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listCourseLevelsDto, createCourseLevelDto, updateCourseLevelDto } from './courseLevel.dto.js';

export class CourseLevelController {
  private levelService: CourseLevelService;

  constructor() {
    this.levelService = new CourseLevelService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listCourseLevelsDto.parse(req.query);
      const levels = await this.levelService.listLevels(params);
      res.json(successResponse(levels));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const level = await this.levelService.getLevelById(req.params.id);
      res.json(successResponse(level));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCourseLevelDto.parse(req.body);
      const level = await this.levelService.createLevel(data);
      res.status(201).json(successResponse(level));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateCourseLevelDto.parse(req.body);
      const level = await this.levelService.updateLevel(req.params.id, data);
      res.json(successResponse(level));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.levelService.deleteLevel(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const courseLevelController = new CourseLevelController();

