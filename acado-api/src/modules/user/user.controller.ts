// src/modules/user/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { listUsersDto, createUserDto, updateUserDto, bulkCreateUsersDto } from './user.dto.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listUsersDto.parse(req.query);
      const result = await this.userService.listUsers(params);
      // Handle both old format (with data/items) and new format (array)
      const users = Array.isArray(result) ? result : (result.data || result.items || []);
      res.json(successResponse(users));
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.userId);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createUserDto.parse(req.body);
      const user = await this.userService.createUser(data);
      res.status(201).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = updateUserDto.parse(req.body);
      const user = await this.userService.updateUser(req.params.userId, data);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  bulkImportUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = bulkCreateUsersDto.parse(req.body);
      const users = await this.userService.bulkCreateUsers(data.users);
      res.status(201).json(successResponse({ data: users }));
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();

