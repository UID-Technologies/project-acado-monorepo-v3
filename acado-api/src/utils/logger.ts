// src/utils/logger.ts
import pino from 'pino';
export default pino({ level: process.env.LOG_LEVEL || 'info' });
