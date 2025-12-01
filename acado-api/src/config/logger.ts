// src/config/logger.ts
import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Simple logger configuration
// For ESM compatibility, we'll use basic logging without transport
// pino-pretty has issues with ESM module resolution
const loggerConfig: pino.LoggerOptions = {
  level: logLevel,
  ...(process.env.NODE_ENV !== 'production' && {
    // In development, use pretty formatting via base options
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
};

export const logger = pino(loggerConfig);

export default logger;

