// src/modules/learningOutcome/learningOutcome.routes.ts
import { Router } from 'express';
import { learningOutcomeController } from './learningOutcome.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createLearningOutcomeDto, updateLearningOutcomeDto } from './learningOutcome.dto.js';

const router = Router();

router.get('/', learningOutcomeController.list);
router.get('/:id', learningOutcomeController.getOne);

router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createLearningOutcomeDto, 'body'), learningOutcomeController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateLearningOutcomeDto, 'body'), learningOutcomeController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), learningOutcomeController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), learningOutcomeController.remove);

export default router;

