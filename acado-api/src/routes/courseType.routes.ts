// src/routes/courseType.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/courseType.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import validate from '../middleware/validate.js';
import { createCourseTypeSchema, updateCourseTypeSchema, courseTypeIdParamSchema } from '../schemas/courseType.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', validate(courseTypeIdParamSchema), controller.getOne);

router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(createCourseTypeSchema),
  controller.create
);

router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateCourseTypeSchema),
  controller.update
);

router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateCourseTypeSchema),
  controller.update
);

router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(courseTypeIdParamSchema),
  controller.remove
);

export default router;


