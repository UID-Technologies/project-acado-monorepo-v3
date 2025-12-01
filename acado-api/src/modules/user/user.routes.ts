// src/modules/user/user.routes.ts
import { Router } from 'express';
import { userController } from './user.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { createUserDto, updateUserDto, bulkCreateUsersDto } from './user.dto.js';
// Note: universityScope middleware may need to be migrated or recreated

const router = Router();

router.use(requireAuth, permit('superadmin', 'admin'));

router.get('/', userController.getUsers);
router.post('/', validateRequest(createUserDto, 'body'), userController.createUser);
router.post('/bulk', validateRequest(bulkCreateUsersDto, 'body'), userController.bulkImportUsers);
router.get('/:userId', userController.getUser);
router.patch('/:userId', validateRequest(updateUserDto, 'body'), userController.updateUser);
router.delete('/:userId', userController.deleteUser);

export default router;

