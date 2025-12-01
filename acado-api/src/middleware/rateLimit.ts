// src/middleware/rateLimit.ts
import { rateLimit } from 'express-rate-limit';
export default rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
