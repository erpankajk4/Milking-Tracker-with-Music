import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../shared/logger/logger.js';

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    isConnected = true;
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (!isConnected && mongoose.connection.readyState === 0) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error during MongoDB disconnect', error);
    throw error;
  }
}
