import { Request, Response, NextFunction } from 'express';
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  bulkCreateUsers,
} from '../services/user.service.js';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      userType,
      status,
      organizationId,
      organizationName,
      universityId,
      universityName,
      page,
      pageSize,
    } = req.query;

    const result = await listUsers({
      search: search as string,
      userType: userType as any,
      status: status as any,
      organizationId: organizationId as string,
      organizationName: organizationName as string,
      universityId: universityId as string,
      universityName: universityName as string,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.params.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await updateUser(req.params.userId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req.params.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const bulkImportUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await bulkCreateUsers(req.body?.users || []);
    res.status(201).json({ data: users });
  } catch (error) {
    next(error);
  }
};
