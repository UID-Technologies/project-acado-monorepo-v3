// src/modules/field/field.routes.ts
import { Router } from 'express';
import { fieldController } from './field.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import {
  createFieldDto,
  queryFieldsDto,
} from './field.dto.js';

const router = Router();

router.get('/', validateRequest(queryFieldsDto, 'query'), fieldController.search);
router.get('/:id', fieldController.getOne);
router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(createFieldDto, 'body'), fieldController.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), fieldController.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), fieldController.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), fieldController.remove);

export default router;

