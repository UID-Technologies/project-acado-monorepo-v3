// src/modules/learningOutcome/learningOutcome.controller.ts
import { Request, Response, NextFunction } from 'express';
import { LearningOutcomeService } from './learningOutcome.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listLearningOutcomesDto, createLearningOutcomeDto, updateLearningOutcomeDto } from './learningOutcome.dto.js';

export class LearningOutcomeController {
  private outcomeService: LearningOutcomeService;

  constructor() {
    this.outcomeService = new LearningOutcomeService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listLearningOutcomesDto.parse(req.query);
      const outcomes = await this.outcomeService.listLearningOutcomes(params);
      res.json(successResponse(outcomes));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outcome = await this.outcomeService.getLearningOutcomeById(req.params.id);
      res.json(successResponse(outcome));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createLearningOutcomeDto.parse(req.body);
      const outcome = await this.outcomeService.createLearningOutcome(data);
      res.status(201).json(successResponse(outcome));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateLearningOutcomeDto.parse(req.body);
      const outcome = await this.outcomeService.updateLearningOutcome(req.params.id, data);
      res.json(successResponse(outcome));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.outcomeService.deleteLearningOutcome(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const learningOutcomeController = new LearningOutcomeController();

