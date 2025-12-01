// src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import {
  registerDto,
  loginDto,
  changePasswordDto,
  updateProfileDto,
  forgotPasswordDto,
  resetPasswordDto,
} from './auth.dto.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerDto.parse(req.body);
      const result = await this.authService.register(data, res);
      res.status(201).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = loginDto.parse(req.body);
      const result = await this.authService.login(data, res);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
      const userId = (req as any).user?.sub || (req as any).user?.id;
      
      await this.authService.logout(refreshToken, userId);
      
      res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 0,
      });
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;
      if (!userId) {
        return next(new Error('UNAUTHORIZED'));
      }
      const user = await this.authService.getProfile(userId);
      res.json(successResponse(user.toJSON()));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;
      if (!userId) {
        return next(new Error('UNAUTHORIZED'));
      }
      const data = updateProfileDto.parse(req.body);
      const user = await this.authService.updateProfile(userId, data);
      res.json(successResponse(user.toJSON()));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;
      if (!userId) {
        return next(new Error('UNAUTHORIZED'));
      }
      const data = changePasswordDto.parse(req.body);
      const result = await this.authService.changePassword(userId, data, res);
      res.json(successResponse({
        message: 'Password updated successfully',
        ...result,
      }));
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.[REFRESH_COOKIE_NAME] ||
        req.body?.refreshToken ||
        req.headers['x-refresh-token'];
      
      if (typeof token !== 'string') {
        return next(new Error('UNAUTHORIZED'));
      }
      
      const result = await this.authService.refreshToken(token, res);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = forgotPasswordDto.parse(req.body);
      const result = await this.authService.forgotPassword(data);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = resetPasswordDto.parse(req.body);
      const result = await this.authService.resetPassword(data);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
export const authController = new AuthController();

