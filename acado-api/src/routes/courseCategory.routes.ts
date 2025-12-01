// src/routes/courseCategory.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/courseCategory.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import validate from '../middleware/validate.js';
import { createCourseCategorySchema, updateCourseCategorySchema, courseCategoryIdParamSchema } from '../schemas/courseCategory.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', validate(courseCategoryIdParamSchema), controller.getOne);

router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(createCourseCategorySchema),
  controller.create
);

router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateCourseCategorySchema),
  controller.update
);

router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateCourseCategorySchema),
  controller.update
);

router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(courseCategoryIdParamSchema),
  controller.remove
);

export default router;


