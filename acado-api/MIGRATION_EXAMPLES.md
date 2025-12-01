# Migration Examples

This document provides concrete code examples for the migration patterns.

## Example 1: Base Repository Implementation

### `src/infrastructure/database/mongo/BaseRepository.ts`

```typescript
import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    return this.model.findById(id, null, options).exec();
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    return this.model.findOne(filter, null, options).exec();
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    return this.model.insertMany(data);
  }

  async update(id: string, data: UpdateQuery<T>, options?: QueryOptions): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, ...options }).exec();
  }

  async updateOne(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount > 0;
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }

  async paginate(
    filter: FilterQuery<T>,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const { page = 1, pageSize = 10, sort } = options;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.count(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
```

## Example 2: User Repository

### `src/modules/user/user.repo.ts`

```typescript
import { BaseRepository } from '../../../infrastructure/database/mongo/BaseRepository.js';
import User, { UserDocument, IUser } from './user.model.js';
import { FilterQuery } from 'mongoose';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.findOne({ username: username.toLowerCase() });
  }

  async findByEmailOrUsername(identifier: string): Promise<UserDocument | null> {
    return this.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });
  }

  async findActiveUsers(filter: FilterQuery<UserDocument> = {}): Promise<UserDocument[]> {
    return this.find({ ...filter, isActive: true });
  }

  async findUsersByRole(role: IUser['role']): Promise<UserDocument[]> {
    return this.find({ role });
  }

  async findUsersByOrganization(organizationId: string): Promise<UserDocument[]> {
    return this.find({ organizationId });
  }

  async findUsersByUniversity(universityId: string): Promise<UserDocument[]> {
    return this.find({ universityIds: universityId });
  }

  async updateTokenVersion(userId: string, version: number): Promise<UserDocument | null> {
    return this.update(userId, { tokenVersion: version });
  }

  async activateUser(userId: string): Promise<UserDocument | null> {
    return this.update(userId, { isActive: true });
  }

  async deactivateUser(userId: string): Promise<UserDocument | null> {
    return this.update(userId, { isActive: false });
  }
}
```

## Example 3: User Service (Refactored)

### `src/modules/user/user.service.ts`

```typescript
import { UserRepository } from './user.repo.js';
import { CreateUserDto, UpdateUserDto, ListUsersDto } from './user.dto.js';
import { ApiError } from '../../../core/http/ApiError.js';
import { hashPassword, comparePassword } from '../../../core/utils/crypto.js';
import User, { UserDocument } from './user.model.js';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async listUsers(params: ListUsersDto) {
    const { search, userType, status, organizationId, page, pageSize } = params;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    if (userType) filter.userType = userType;
    if (status) filter.isActive = status === 'active';
    if (organizationId) filter.organizationId = organizationId;

    return this.userRepo.paginate(filter, { page, pageSize });
  }

  async getUserById(userId: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return user;
  }

  async createUser(data: CreateUserDto): Promise<UserDocument> {
    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(409, 'User already exists', 'USER_EXISTS');
    }

    // Check username if provided
    if (data.username) {
      const existingUsername = await this.userRepo.findByUsername(data.username);
      if (existingUsername) {
        throw new ApiError(409, 'Username already taken', 'USERNAME_EXISTS');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const userData = {
      ...data,
      password: hashedPassword,
      email: data.email.toLowerCase(),
      username: data.username?.toLowerCase(),
    };

    return this.userRepo.create(userData);
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserDocument> {
    const user = await this.getUserById(userId);

    // Check email uniqueness if changing
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepo.findByEmail(data.email);
      if (existingUser) {
        throw new ApiError(409, 'Email already in use', 'EMAIL_EXISTS');
      }
    }

    // Check username uniqueness if changing
    if (data.username && data.username !== user.username) {
      const existingUser = await this.userRepo.findByUsername(data.username);
      if (existingUser) {
        throw new ApiError(409, 'Username already taken', 'USERNAME_EXISTS');
      }
    }

    // Hash password if provided
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }
    if (updateData.username) {
      updateData.username = updateData.username.toLowerCase();
    }

    const updatedUser = await this.userRepo.update(userId, updateData);
    if (!updatedUser) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const deleted = await this.userRepo.delete(userId);
    if (!deleted) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
  }

  async verifyPassword(user: UserDocument, password: string): Promise<boolean> {
    return comparePassword(password, user.password);
  }
}
```

## Example 4: User DTOs

### `src/modules/user/user.dto.ts`

```typescript
import { z } from 'zod';

// Create User DTO
export const createUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50).optional(),
  userType: z.enum(['Learner', 'Faculty', 'Staff', 'Admin']).optional(),
  role: z.enum(['superadmin', 'admin', 'learner']).optional(),
  organizationId: z.string().optional().nullable(),
  organizationName: z.string().optional(),
  universityId: z.string().optional().nullable(),
  mobileNo: z.string().optional(),
  studentIdStaffId: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
});

export type CreateUserDto = z.infer<typeof createUserDto>;

// Update User DTO
export const updateUserDto = createUserDto.partial();
export type UpdateUserDto = z.infer<typeof updateUserDto>;

// List Users DTO
export const listUsersDto = z.object({
  search: z.string().optional(),
  userType: z.enum(['Learner', 'Faculty', 'Staff', 'Admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  universityId: z.string().optional(),
  universityName: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export type ListUsersDto = z.infer<typeof listUsersDto>;
```

## Example 5: User Controller (Refactored)

### `src/modules/user/user.controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { successResponse } from '../../../core/http/ApiResponse.js';
import { validateRequest } from '../../../core/middleware/validateMiddleware.js';
import { listUsersDto, createUserDto, updateUserDto } from './user.dto.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listUsersDto.parse(req.query);
      const result = await this.userService.listUsers(params);
      res.json(successResponse(result.data, result.pagination));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.userId);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  };

  create = [
    validateRequest(createUserDto, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await this.userService.createUser(req.body);
        res.status(201).json(successResponse(user));
      } catch (error) {
        next(error);
      }
    },
  ];

  update = [
    validateRequest(updateUserDto, 'body'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await this.userService.updateUser(req.params.userId, req.body);
        res.json(successResponse(user));
      } catch (error) {
        next(error);
      }
    },
  ];

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
export const userController = new UserController();
```

## Example 6: User Routes

### `src/modules/user/user.routes.ts`

```typescript
import { Router } from 'express';
import { userController } from './user.controller.js';
import { requireAuth } from '../../../core/middleware/authMiddleware.js';
import { permit } from '../../../core/middleware/rbacMiddleware.js';

const router = Router();

// Public routes (if any)
// router.get('/public', userController.getPublicUsers);

// Protected routes
router.get('/', requireAuth, permit('superadmin', 'admin'), userController.list);
router.get('/:userId', requireAuth, permit('superadmin', 'admin'), userController.getOne);
router.post('/', requireAuth, permit('superadmin', 'admin'), ...userController.create);
router.put('/:userId', requireAuth, permit('superadmin', 'admin'), ...userController.update);
router.patch('/:userId', requireAuth, permit('superadmin', 'admin'), ...userController.update);
router.delete('/:userId', requireAuth, permit('superadmin', 'admin'), userController.delete);

export default router;
```

## Example 7: Express Loader

### `src/loaders/express.ts`

```typescript
import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import requestId from 'express-request-id';
import { pinoHttp } from 'pino-http';
import { loadEnv } from '../config/env.js';
import { logger } from '../config/logger.js';
import { rateLimiter } from '../core/middleware/rateLimiter.js';
import { requestLogger } from '../core/middleware/requestLogger.js';
import { errorHandler, notFound } from '../core/middleware/errorHandler.js';

export function loadExpress(): Express {
  const app = express();
  const { CORS_ORIGIN, NODE_ENV } = loadEnv();

  // Request ID
  app.use(requestId());

  // Security
  const useStrictSecurity = process.env.USE_HTTPS === 'true';
  app.use(helmet({
    crossOriginOpenerPolicy: useStrictSecurity ? { policy: 'same-origin' } : false,
    contentSecurityPolicy: useStrictSecurity ? undefined : false,
    crossOriginEmbedderPolicy: useStrictSecurity ? { policy: 'require-corp' } : false,
    hsts: useStrictSecurity ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  }));

  // CORS
  const allowedOrigins = NODE_ENV === 'production'
    ? CORS_ORIGIN.split(',').map(o => o.trim())
    : (CORS_ORIGIN ? CORS_ORIGIN.split(',').map(o => o.trim()) : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080']);

  app.use(cors({
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (!useStrictSecurity && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }));

  // Body parsing
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Middleware
  app.use(rateLimiter);
  app.use(pinoHttp({ logger }));
  app.use(requestLogger);

  // Health check
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

  return app;
}
```

## Example 8: Route Loader

### `src/loaders/routes.ts`

```typescript
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from '../docs/openapi.js';

// Import all module routes
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import universityRoutes from '../modules/university/university.routes.js';
import courseRoutes from '../modules/course/course.routes.js';
// ... import other routes

export function loadRoutes(app: Express): void {
  // API Documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

  // Authentication routes
  app.use('/auth', authRoutes);

  // Dashboard routes
  app.use('/dashboard', dashboardRoutes);

  // Upload routes
  app.use('/upload', uploadRoutes);

  // JSON Server compatible routes (no /v1 prefix)
  app.use('/masterCategories', categoryRoutes);
  app.use('/masterFields', fieldRoutes);
  app.use('/forms', formRoutes);
  app.use('/universities', universityRoutes);
  app.use('/courses', courseRoutes);
  app.use('/organizations', organizationRoutes);
  app.use('/course-categories', courseCategoryRoutes);
  app.use('/course-types', courseTypeRoutes);
  app.use('/course-levels', courseLevelRoutes);
  app.use('/learning-outcomes', learningOutcomeRoutes);
  app.use('/applications', applicationRoutes);
  app.use('/users', userRoutes);
  app.use('/locations', locationRoutes);
  app.use('/emails', emailRoutes);

  // Engagement Builder routes
  app.use('/wall-posts', wallPostRoutes);
  app.use('/community-posts', communityPostRoutes);
  app.use('/reels', reelRoutes);
  app.use('/events', eventRoutes);
  app.use('/scholarships', scholarshipRoutes);

  // Legacy v1 routes for backward compatibility
  app.use('/v1/categories', categoryRoutes);
  app.use('/v1/fields', fieldRoutes);
  // ... other v1 routes
}
```

## Example 9: Main Loader

### `src/loaders/index.ts`

```typescript
import { Express } from 'express';
import { connect } from '../config/db.js';
import { loadEnv } from '../config/env.js';
import { loadExpress } from './express.js';
import { loadRoutes } from './routes.js';
import { errorHandler, notFound } from '../core/middleware/errorHandler.js';

export async function loadApp(): Promise<Express> {
  const { MONGO_URI } = loadEnv();

  // Connect to database
  await connect(MONGO_URI);

  // Load Express app
  const app = loadExpress();

  // Load routes
  loadRoutes(app);

  // Error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
```

## Example 10: Updated Server Entry Point

### `src/server.ts`

```typescript
import 'dotenv/config';
import { loadApp } from './loaders/index.js';
import { loadEnv } from './config/env.js';
import { logger } from './config/logger.js';

const { PORT } = loadEnv();

(async () => {
  try {
    const app = await loadApp();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`API listening on :${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
})();
```

## Example 11: Crypto Utilities

### `src/core/utils/crypto.ts`

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateRandomToken(length: number = 32): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}
```

## Example 12: Enhanced Validate Middleware

### `src/core/middleware/validateMiddleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../../http/ApiError.js';

export function validateRequest(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      const validated = schema.parse(data);
      
      // Replace original data with validated data
      if (source === 'body') req.body = validated;
      else if (source === 'query') req.query = validated;
      else req.params = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validation failed', details));
      }
      next(error);
    }
  };
}
```

These examples provide concrete patterns to follow during migration. Use them as templates for refactoring each module.

