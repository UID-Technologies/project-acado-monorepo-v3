// src/routes/learningOutcome.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/learningOutcome.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import validate from '../middleware/validate.js';
import {
  createLearningOutcomeSchema,
  updateLearningOutcomeSchema,
  learningOutcomeIdParamSchema,
} from '../schemas/learningOutcome.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', validate(learningOutcomeIdParamSchema), controller.getOne);

router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(createLearningOutcomeSchema),
  controller.create
);

router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateLearningOutcomeSchema),
  controller.update
);

router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateLearningOutcomeSchema),
  controller.update
);

router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(learningOutcomeIdParamSchema),
  controller.remove
);

export default router;


