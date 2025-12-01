// src/controllers/organization.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/organization.service.js';

export const listOrganizations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const organizations = await service.listOrganizations();
    res.json({ organizations });
  } catch (error) {
    next(error);
  }
};

export const listOrganizationsPublic = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const organizations = await service.listOrganizationsPublic();
    res.json({ organizations });
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.createOrganization(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizationId } = req.params;
    const organization = await service.getOrganizationById(organizationId);
    res.json(organization);
  } catch (error) {
    next(error);
  }
};

export const addOrganizationAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizationId } = req.params;
    const result = await service.addOrganizationAdmin(organizationId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizationId } = req.params;
    const organization = await service.updateOrganizationInfo(organizationId, req.body);
    res.json({ organization });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;
    const organization = await service.updateOrganizationContacts(organizationId, req.body);
    res.json({ organization });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationSuspension = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizationId } = req.params;
    const { suspended } = req.body;
    const organization = await service.updateOrganizationSuspension(organizationId, suspended);
    res.json({ organization });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizationId } = req.params;
    const organization = await service.updateOrganizationLocation(organizationId, req.body);
    res.json({ organization });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationOnboardingStage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId } = req.params;
    const { onboardingStage } = req.body;
    const organization = await service.updateOrganizationOnboardingStage(organizationId, onboardingStage);
    res.json({ organization });
  } catch (error) {
    next(error);
  }
};


