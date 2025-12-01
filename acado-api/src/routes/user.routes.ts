import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUserController,
  updateUserController,
  deleteUserController,
  bulkImportUsersController,
} from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import { scopeByUniversity, validateUniversityAccess } from '../middleware/universityScope.js';

const router = Router();

router.use(requireAuth, permit('superadmin', 'admin'));

router
  .route('/')
  .get(scopeByUniversity, getUsers)
  .post(validateUniversityAccess, createUserController);

router.post('/bulk', bulkImportUsersController);

router
  .route('/:userId')
  .get(getUser)
  .patch(validateUniversityAccess, updateUserController)
  .delete(validateUniversityAccess, deleteUserController);

export default router;
