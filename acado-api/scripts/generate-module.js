#!/usr/bin/env node
/**
 * Module Generator Script
 * 
 * Usage: node scripts/generate-module.js <moduleName>
 * Example: node scripts/generate-module.js university
 * 
 * This script generates the basic structure for a new module following
 * the clean architecture pattern.
 */

const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Module name is required');
  console.log('Usage: node scripts/generate-module.js <moduleName>');
  process.exit(1);
}

const moduleDir = path.join(__dirname, '..', 'src', 'modules', moduleName);
const capitalized = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// Create directory
if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
  console.log(`✅ Created directory: ${moduleDir}`);
} else {
  console.log(`⚠️  Directory already exists: ${moduleDir}`);
}

// Template files
const templates = {
  model: `// src/modules/${moduleName}/${moduleName}.model.ts
// TODO: Move model from src/models/${capitalized}.ts
// Or create new model here
export interface I${capitalized} {
  id: string;
  // Add fields here
  createdAt?: Date;
  updatedAt?: Date;
}

// TODO: Implement Mongoose schema
export default model<I${capitalized}>('${capitalized}', ${capitalized}Schema);
`,

  repo: `// src/modules/${moduleName}/${moduleName}.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import ${capitalized}, { I${capitalized} } from './${moduleName}.model.js';
import { Document } from 'mongoose';

export type ${capitalized}Document = Document<unknown, {}, I${capitalized}> & I${capitalized};

export class ${capitalized}Repository extends BaseRepository<${capitalized}Document> {
  constructor() {
    super(${capitalized});
  }

  // Add custom repository methods here
}
`,

  dto: `// src/modules/${moduleName}/${moduleName}.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const create${capitalized}Dto = z.object({
  // Add fields here
});

export const update${capitalized}Dto = create${capitalized}Dto.partial();

export const list${capitalized}sDto = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
});

export type Create${capitalized}Dto = z.infer<typeof create${capitalized}Dto>;
export type Update${capitalized}Dto = z.infer<typeof update${capitalized}Dto>;
export type List${capitalized}sDto = z.infer<typeof list${capitalized}sDto>;
`,

  service: `// src/modules/${moduleName}/${moduleName}.service.ts
import { ${capitalized}Repository } from './${moduleName}.repo.js';
import { NotFoundError, ConflictError } from '../../core/http/ApiError.js';
import {
  Create${capitalized}Dto,
  Update${capitalized}Dto,
  List${capitalized}sDto,
} from './${moduleName}.dto.js';

export class ${capitalized}Service {
  private ${moduleName}Repo: ${capitalized}Repository;

  constructor() {
    this.${moduleName}Repo = new ${capitalized}Repository();
  }

  async list${capitalized}s(params: List${capitalized}sDto) {
    const { search, page = 1, pageSize = 10 } = params;
    
    const filter: any = {};
    if (search) {
      // Add search logic
    }

    return this.${moduleName}Repo.paginate(filter, { page, pageSize });
  }

  async get${capitalized}ById(id: string) {
    const ${moduleName} = await this.${moduleName}Repo.findById(id);
    if (!${moduleName}) {
      throw new NotFoundError('${capitalized} not found');
    }
    return ${moduleName}.toJSON();
  }

  async create${capitalized}(data: Create${capitalized}Dto) {
    // Add validation and business logic
    return this.${moduleName}Repo.create(data);
  }

  async update${capitalized}(id: string, data: Update${capitalized}Dto) {
    const updated = await this.${moduleName}Repo.update(id, data);
    if (!updated) {
      throw new NotFoundError('${capitalized} not found');
    }
    return updated.toJSON();
  }

  async delete${capitalized}(id: string) {
    const deleted = await this.${moduleName}Repo.delete(id);
    if (!deleted) {
      throw new NotFoundError('${capitalized} not found');
    }
  }
}
`,

  controller: `// src/modules/${moduleName}/${moduleName}.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ${capitalized}Service } from './${moduleName}.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import {
  create${capitalized}Dto,
  update${capitalized}Dto,
  list${capitalized}sDto,
} from './${moduleName}.dto.js';

export class ${capitalized}Controller {
  private ${moduleName}Service: ${capitalized}Service;

  constructor() {
    this.${moduleName}Service = new ${capitalized}Service();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = list${capitalized}sDto.parse(req.query);
      const result = await this.${moduleName}Service.list${capitalized}s(params);
      res.json(successResponse(result.data, result.pagination));
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ${moduleName} = await this.${moduleName}Service.get${capitalized}ById(req.params.id);
      res.json(successResponse(${moduleName}));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = create${capitalized}Dto.parse(req.body);
      const ${moduleName} = await this.${moduleName}Service.create${capitalized}(data);
      res.status(201).json(successResponse(${moduleName}));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = update${capitalized}Dto.parse(req.body);
      const ${moduleName} = await this.${moduleName}Service.update${capitalized}(req.params.id, data);
      res.json(successResponse(${moduleName}));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.${moduleName}Service.delete${capitalized}(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const ${moduleName}Controller = new ${capitalized}Controller();
`,

  routes: `// src/modules/${moduleName}/${moduleName}.routes.ts
import { Router } from 'express';
import { ${moduleName}Controller } from './${moduleName}.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import {
  create${capitalized}Dto,
  update${capitalized}Dto,
} from './${moduleName}.dto.js';

const router = Router();

// Public routes
router.get('/', ${moduleName}Controller.list);
router.get('/:id', ${moduleName}Controller.getOne);

// Protected routes
router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(create${capitalized}Dto, 'body'), ${moduleName}Controller.create);
router.put('/:id', requireAuth, permit('superadmin', 'admin'), validateRequest(update${capitalized}Dto, 'body'), ${moduleName}Controller.update);
router.patch('/:id', requireAuth, permit('superadmin', 'admin'), ${moduleName}Controller.update);
router.delete('/:id', requireAuth, permit('superadmin', 'admin'), ${moduleName}Controller.delete);

export default router;
`
};

// Write template files
Object.entries(templates).forEach(([name, content]) => {
  const filePath = path.join(moduleDir, `${moduleName}.${name}.ts`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️  File already exists: ${filePath}`);
  }
});

console.log(`\n✅ Module structure generated for: ${moduleName}`);
console.log(`📝 Next steps:`);
console.log(`   1. Move model from src/models/${capitalized}.ts`);
console.log(`   2. Update repository with custom queries`);
console.log(`   3. Define DTOs based on existing schemas`);
console.log(`   4. Refactor service logic`);
console.log(`   5. Update controller`);
console.log(`   6. Add routes to loaders/routes.ts`);

