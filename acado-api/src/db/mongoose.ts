// src/db/mongoose.ts
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export async function connect(uri: string) {
  mongoose.connection.on('connected', () => logger.info('Mongo connected'));
  mongoose.connection.on('error', err => logger.error({ err }, 'Mongo error'));
  await mongoose.connect(uri);
}

export async function disconnect() {
  await mongoose.disconnect();
}
