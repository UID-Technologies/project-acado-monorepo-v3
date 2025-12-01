// src/modules/application/application.routes.ts
import { Router } from 'express';
import { applicationController } from './application.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createApplicationDto, updateApplicationDto, reviewApplicationDto, queryApplicationsDto } from './application.dto.js';

const router = Router();

// Get application statistics
router.get('/stats', requireAuth, validateRequest(queryApplicationsDto, 'query'), applicationController.stats);

// List applications (with filters)
router.get('/', requireAuth, validateRequest(queryApplicationsDto, 'query'), applicationController.list);

// Get single application
router.get('/:id', requireAuth, applicationController.getOne);

// Create new application (users can create their own)
router.post('/', requireAuth, validateRequest(createApplicationDto, 'body'), applicationController.create);

// Update application (users can update their own drafts)
router.put('/:id', requireAuth, validateRequest(updateApplicationDto, 'body'), applicationController.update);
router.patch('/:id', requireAuth, applicationController.update);

// Delete application
router.delete('/:id', requireAuth, applicationController.remove);

// Submit application (change status from draft to submitted)
router.post('/:id/submit', requireAuth, applicationController.submit);

// Withdraw application
router.post('/:id/withdraw', requireAuth, applicationController.withdraw);

// Review application (admin/editor only)
router.post('/:id/review', requireAuth, permit('superadmin', 'admin'), validateRequest(reviewApplicationDto, 'body'), applicationController.review);

export default router;

