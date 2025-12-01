// src/loaders/index.ts
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

