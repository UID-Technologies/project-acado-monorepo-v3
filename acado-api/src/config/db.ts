// src/config/db.ts
import mongoose from 'mongoose';
import { logger } from './logger.js';

export interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

const defaultOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export async function connect(uri: string, options?: mongoose.ConnectOptions): Promise<void> {
  try {
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    await mongoose.connect(uri, { ...defaultOptions, ...options });
    logger.info('MongoDB connection established');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to MongoDB');
    throw error;
  }
}

export async function disconnect(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error({ err: error }, 'Error disconnecting from MongoDB');
    throw error;
  }
}

export async function isConnected(): Promise<boolean> {
  return mongoose.connection.readyState === 1;
}

export function getConnectionState(): string {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
}

