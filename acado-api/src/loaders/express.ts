// src/loaders/express.ts
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
      if (!useStrictSecurity && (origin.includes('57.159.29.149') || origin.includes('172.17.'))) {
        return callback(null, true);
      }
      console.warn(`❌ CORS blocked: ${origin} | Allowed: ${allowedOrigins.join(', ')}`);
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

