// src/controllers/form.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/form.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.listForms(req.query);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await service.getFormById(req.params.id);
    res.json(form);
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await service.createForm(req.body, (req as any).user?.id);
    res.status(201).json(form);
  } catch (e) {
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await service.updateForm(req.params.id, req.body);
    res.json(form);
  } catch (e) {
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.deleteForm(req.params.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const publish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await service.publishForm(req.params.id);
    res.json(form);
  } catch (e) {
    next(e);
  }
};

export const archive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await service.archiveForm(req.params.id);
    res.json(form);
  } catch (e) {
    next(e);
  }
};

export const duplicate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await service.duplicateForm(req.params.id, (req as any).user?.id);
    res.status(201).json(form);
  } catch (e) {
    next(e);
  }
};

export const getFormByCourseId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getFormByCourseId(req.params.courseId);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

