// src/modules/courseType/courseType.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CourseTypeService } from './courseType.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listCourseTypesDto, createCourseTypeDto, updateCourseTypeDto } from './courseType.dto.js';

export class CourseTypeController {
  private typeService: CourseTypeService;

  constructor() {
    this.typeService = new CourseTypeService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listCourseTypesDto.parse(req.query);
      const types = await this.typeService.listTypes(params);
      res.json(successResponse(types));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = await this.typeService.getTypeById(req.params.id);
      res.json(successResponse(type));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createCourseTypeDto.parse(req.body);
      const type = await this.typeService.createType(data);
      res.status(201).json(successResponse(type));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateCourseTypeDto.parse(req.body);
      const type = await this.typeService.updateType(req.params.id, data);
      res.json(successResponse(type));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.typeService.deleteType(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const courseTypeController = new CourseTypeController();

