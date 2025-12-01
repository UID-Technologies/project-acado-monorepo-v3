// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from './middleware/rateLimit.js';
import requestId from 'express-request-id';
import routes from './routes/index.js';
import { errorConverter, errorHandler, notFound } from './middleware/error.js';
import { pinoHttp } from 'pino-http';
import logger from './utils/logger.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './docs/openapi.js';
import { loadEnv } from './config/env.js';

const app = express();
const { CORS_ORIGIN, NODE_ENV } = loadEnv();

app.use(requestId());

// Configure helmet: strict security for HTTPS, relaxed for HTTP (for Swagger UI)
const isProduction = NODE_ENV === 'production';
const useStrictSecurity = process.env.USE_HTTPS === 'true'; // Set to 'true' when behind HTTPS

app.use(helmet({
  crossOriginOpenerPolicy: useStrictSecurity ? { policy: 'same-origin' } : false,
  contentSecurityPolicy: useStrictSecurity ? undefined : false, // Disable for Swagger UI on HTTP
  crossOriginEmbedderPolicy: useStrictSecurity ? { policy: 'require-corp' } : false,
  hsts: useStrictSecurity ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? CORS_ORIGIN.split(',').map(o => o.trim())
    : (CORS_ORIGIN
        ? CORS_ORIGIN.split(',').map(o => o.trim())
        : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080']);

// CORS Configuration
const corsOptions = {
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For non-HTTPS environments, be more permissive (staging/development)
    if (!useStrictSecurity) {
      // Allow any localhost or 127.0.0.1
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      
      // Allow same IP as server (for VM-based deployments)
      if (origin.includes('57.159.29.149') || origin.includes('172.17.')) {
        return callback(null, true);
      }
    }
    
    // Log rejected origins to help debug
    console.warn(`❌ CORS blocked: ${origin} | Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimit);

app.use(pinoHttp({ logger }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/', routes);



app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

export default app;
