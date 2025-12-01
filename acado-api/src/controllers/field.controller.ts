// src/controllers/field.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/field.service.js';

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.searchFields({
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      subcategoryId: req.query.subcategoryId as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      sort: req.query.sort as string | undefined,
    });
    // Return just the items array for JSON Server compatibility
    res.json(result.items);
  } catch (e) { next(e); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createField({ ...req.body, createdBy: (req as any).user?.id });
    res.status(201).json(data); // Return direct data
  } catch (e) { next(e); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await service.getFieldById(req.params.id);
    res.json(doc);
  } catch (e) { next(e); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await service.updateField(req.params.id, req.body);
    res.json(updated);
  } catch (e) { next(e); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteField(req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
};
