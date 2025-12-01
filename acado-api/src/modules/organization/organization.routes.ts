// src/modules/organization/organization.routes.ts
import { Router } from 'express';
import { organizationController } from './organization.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import {
  createOrganizationDto,
  updateOrganizationInfoDto,
  updateOrganizationContactsDto,
  updateOrganizationLocationDto,
  updateOrganizationStageDto,
  organizationStatusDto,
  adminInviteDto,
} from './organization.dto.js';

const router = Router();

router.get('/public', organizationController.listOrganizationsPublic);
router.get('/', requireAuth, permit('superadmin', 'admin'), organizationController.listOrganizations);
router.get('/:organizationId', requireAuth, permit('superadmin', 'admin'), organizationController.getOrganization);
router.post('/', requireAuth, permit('superadmin'), validateRequest(createOrganizationDto, 'body'), organizationController.createOrganization);
router.post('/:organizationId/admins', requireAuth, permit('superadmin'), validateRequest(adminInviteDto, 'body'), organizationController.addOrganizationAdmin);
router.patch('/:organizationId/status', requireAuth, permit('superadmin'), validateRequest(organizationStatusDto, 'body'), organizationController.updateOrganizationSuspension);
router.patch('/:organizationId/location', requireAuth, permit('superadmin', 'admin'), validateRequest(updateOrganizationLocationDto, 'body'), organizationController.updateOrganizationLocation);
router.patch('/:organizationId/info', requireAuth, permit('superadmin'), validateRequest(updateOrganizationInfoDto, 'body'), organizationController.updateOrganizationInfo);
router.patch('/:organizationId/contacts', requireAuth, permit('superadmin', 'admin'), validateRequest(updateOrganizationContactsDto, 'body'), organizationController.updateOrganizationContacts);
router.patch('/:organizationId/onboarding-stage', requireAuth, permit('superadmin', 'admin'), validateRequest(updateOrganizationStageDto, 'body'), organizationController.updateOrganizationOnboardingStage);

export default router;

