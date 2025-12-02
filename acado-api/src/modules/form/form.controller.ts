// src/modules/form/form.controller.ts
import { Request, Response, NextFunction } from 'express';
import { FormService } from './form.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { queryFormsDto, createFormDto, updateFormDto } from './form.dto.js';

export class FormController {
  private formService: FormService;

  constructor() {
    this.formService = new FormService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = queryFormsDto.parse(req.query);
      const result = await this.formService.listForms(query);
      // Handle both old format (with forms/data/items) and new format (array)
      const forms = Array.isArray(result) 
        ? result 
        : ((result as any).forms || (result as any).data || (result as any).items || []);
      res.json(successResponse(forms));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = await this.formService.getFormById(req.params.id);
      res.json(successResponse(form));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createFormDto.parse(req.body);
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const form = await this.formService.createForm(data, userId);
      res.status(201).json(successResponse(form));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateFormDto.parse(req.body);
      const form = await this.formService.updateForm(req.params.id, data);
      res.json(successResponse(form));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.formService.deleteForm(req.params.id);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = await this.formService.publishForm(req.params.id);
      res.json(successResponse(form));
    } catch (error) {
      next(error);
    }
  };

  archive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = await this.formService.archiveForm(req.params.id);
      res.json(successResponse(form));
    } catch (error) {
      next(error);
    }
  };

  duplicate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;
      const form = await this.formService.duplicateForm(req.params.id, userId);
      res.status(201).json(successResponse(form));
    } catch (error) {
      next(error);
    }
  };

  getFormByCourseId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.formService.getFormByCourseId(req.params.courseId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };
}

export const formController = new FormController();

