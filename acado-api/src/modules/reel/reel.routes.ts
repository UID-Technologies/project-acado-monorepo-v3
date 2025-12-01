// src/modules/reel/reel.routes.ts
import { Router } from 'express';
import { reelController } from './reel.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createReelDto, updateReelDto } from './reel.dto.js';

const router = Router();

router.get('/', reelController.list);
router.get('/:id', reelController.getOne);
router.post('/', requireAuth, validateRequest(createReelDto, 'body'), reelController.create);
router.put('/:id', requireAuth, validateRequest(updateReelDto, 'body'), reelController.update);
router.patch('/:id', requireAuth, reelController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), reelController.remove);

export default router;

