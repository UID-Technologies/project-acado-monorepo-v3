// src/modules/field/field.controller.ts
import { Request, Response, NextFunction } from 'express';
import { FieldService } from './field.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { queryFieldsDto, createFieldDto, updateFieldDto } from './field.dto.js';

export class FieldController {
  private fieldService: FieldService;

  constructor() {
    this.fieldService = new FieldService();
  }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = queryFieldsDto.parse(req.query);
      const fields = await this.fieldService.searchFields(params);
      res.json(successResponse(fields));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createFieldDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const field = await this.fieldService.createField(data, userId);
      res.status(201).json(successResponse(field));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const field = await this.fieldService.getFieldById(req.params.id);
      res.json(successResponse(field));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateFieldDto.parse(req.body);
      const field = await this.fieldService.updateField(req.params.id, data);
      res.json(successResponse(field));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.fieldService.deleteField(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const fieldController = new FieldController();

