// src/modules/form/form.routes.ts
import { Router } from 'express';
import { formController } from './form.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createFormDto, updateFormDto, queryFormsDto } from './form.dto.js';

const router = Router();

// Public routes (view forms)
router.get('/', validateRequest(queryFormsDto, 'query'), formController.list);
router.get('/by-course/:courseId', formController.getFormByCourseId);
router.get('/:id', formController.getOne);

// Protected routes (require authentication)
router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createFormDto, 'body'), formController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(updateFormDto, 'body'), formController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), formController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), formController.remove);

// Form actions
router.post('/:id/publish', requireAuth, permit('superadmin', 'admin'), formController.publish);
router.post('/:id/archive', requireAuth, permit('superadmin', 'admin'), formController.archive);
router.post('/:id/duplicate', requireAuth, permit('superadmin', 'admin'), formController.duplicate);

export default router;

