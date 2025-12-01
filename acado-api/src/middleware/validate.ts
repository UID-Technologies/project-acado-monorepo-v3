// src/middleware/validate.ts
import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
export default (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!parsed.success) {
    // Log validation errors for debugging
    console.error('❌ Validation failed:', {
      path: req.path,
      method: req.method,
      body: req.body,
      errors: parsed.error.errors,
      flattened: parsed.error.flatten()
    });
    
    // Return 422 Unprocessable Entity for validation errors (more appropriate than 400)
    return res.status(422).json({ 
      error: 'VALIDATION_ERROR', 
      message: 'Validation failed',
      details: parsed.error.flatten(),
      errors: parsed.error.errors // Include raw errors for better debugging
    });
  }
  // Attach parsed data if you prefer: req.validated = parsed.data
  next();
};
