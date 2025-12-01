// src/modules/organization/organization.controller.ts
import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from './organization.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import {
  createOrganizationDto,
  updateOrganizationInfoDto,
  updateOrganizationContactsDto,
  updateOrganizationLocationDto,
  updateOrganizationStageDto,
  organizationStatusDto,
  adminInviteDto,
} from './organization.dto.js';

export class OrganizationController {
  private organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  listOrganizations = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const organizations = await this.organizationService.listOrganizations();
      res.json(successResponse({ organizations }));
    } catch (error) {
      next(error);
    }
  };

  listOrganizationsPublic = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const organizations = await this.organizationService.listOrganizationsPublic();
      res.json(successResponse({ organizations }));
    } catch (error) {
      next(error);
    }
  };

  createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createOrganizationDto.parse(req.body);
      const result = await this.organizationService.createOrganization(data);
      res.status(201).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  getOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organization = await this.organizationService.getOrganizationById(req.params.organizationId);
      res.json(successResponse(organization));
    } catch (error) {
      next(error);
    }
  };

  addOrganizationAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = adminInviteDto.parse(req.body);
      const result = await this.organizationService.addOrganizationAdmin(req.params.organizationId, data);
      res.status(201).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  updateOrganizationInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateOrganizationInfoDto.parse(req.body);
      const organization = await this.organizationService.updateOrganizationInfo(req.params.organizationId, data);
      res.json(successResponse({ organization }));
    } catch (error) {
      next(error);
    }
  };

  updateOrganizationContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateOrganizationContactsDto.parse(req.body);
      const organization = await this.organizationService.updateOrganizationContacts(req.params.organizationId, data);
      res.json(successResponse({ organization }));
    } catch (error) {
      next(error);
    }
  };

  updateOrganizationSuspension = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = organizationStatusDto.parse(req.body);
      const organization = await this.organizationService.updateOrganizationSuspension(req.params.organizationId, data.suspended);
      res.json(successResponse({ organization }));
    } catch (error) {
      next(error);
    }
  };

  updateOrganizationLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateOrganizationLocationDto.parse(req.body);
      const organization = await this.organizationService.updateOrganizationLocation(req.params.organizationId, data);
      res.json(successResponse({ organization }));
    } catch (error) {
      next(error);
    }
  };

  updateOrganizationOnboardingStage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateOrganizationStageDto.parse(req.body);
      const organization = await this.organizationService.updateOrganizationOnboardingStage(req.params.organizationId, data.onboardingStage);
      res.json(successResponse({ organization }));
    } catch (error) {
      next(error);
    }
  };
}

export const organizationController = new OrganizationController();

