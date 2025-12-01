// src/modules/wallPost/wallPost.routes.ts
import { Router } from 'express';
import { wallPostController } from './wallPost.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createWallPostDto, updateWallPostDto } from './wallPost.dto.js';

const router = Router();

router.get('/', wallPostController.list);
router.get('/:id', wallPostController.getOne);
router.post('/', requireAuth, validateRequest(createWallPostDto, 'body'), wallPostController.create);
router.put('/:id', requireAuth, validateRequest(updateWallPostDto, 'body'), wallPostController.update);
router.patch('/:id', requireAuth, wallPostController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), wallPostController.remove);

export default router;

