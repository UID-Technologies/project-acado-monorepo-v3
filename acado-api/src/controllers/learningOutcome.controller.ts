// src/controllers/learningOutcome.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/learningOutcome.service.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parentId, includeInactive } = req.query;
    const outcomes = await service.listLearningOutcomes({
      parentId: typeof parentId === 'string' ? parentId : undefined,
      includeInactive: includeInactive === 'true',
    });
    res.json(outcomes);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const outcome = await service.getLearningOutcomeById(req.params.id);
    if (!outcome) {
      return res.status(404).json({ error: 'Learning outcome not found' });
    }
    res.json(outcome);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const outcome = await service.createLearningOutcome(req.body);
    res.status(201).json(outcome);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const outcome = await service.updateLearningOutcome(req.params.id, req.body);
    if (!outcome) {
      return res.status(404).json({ error: 'Learning outcome not found' });
    }
    res.json(outcome);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteLearningOutcome(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


