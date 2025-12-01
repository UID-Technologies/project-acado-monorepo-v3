// src/server.ts
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
