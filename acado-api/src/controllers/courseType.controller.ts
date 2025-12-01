// src/controllers/courseType.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/courseType.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const types = await service.listTypes(includeInactive);
    res.json(types);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = await service.getTypeById(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Course type not found' });
    }
    res.json(type);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = await service.createType(req.body);
    res.status(201).json(type);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = await service.updateType(req.params.id, req.body);
    if (!type) {
      return res.status(404).json({ error: 'Course type not found' });
    }
    res.json(type);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteType(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


