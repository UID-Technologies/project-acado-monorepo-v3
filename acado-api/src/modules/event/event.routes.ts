// src/modules/event/event.routes.ts
import { Router } from 'express';
import { eventController } from './event.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createEventDto, updateEventDto } from './event.dto.js';

const router = Router();

router.get('/', eventController.list);
router.get('/:id', eventController.getOne);
router.post('/', requireAuth, validateRequest(createEventDto, 'body'), eventController.create);
router.put('/:id', requireAuth, validateRequest(updateEventDto, 'body'), eventController.update);
router.patch('/:id', requireAuth, eventController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), eventController.remove);
router.post('/:id/views', eventController.incrementViews);
router.post('/:id/registrations', requireAuth, eventController.incrementRegistrations);

export default router;

