import http from 'http';
import { env } from './config/env.config.js';
import { connectDatabase, disconnectDatabase } from './config/database.config.js';
import { app } from './app.js';
import { logger } from './shared/logger/logger.js';

let isShuttingDown = false;
let server;

async function bootstrap() {
  try {
    await connectDatabase();

    server = http.createServer(app);

    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Server failed to start during bootstrap', error);
    process.exit(1);
  }
}

async function handleShutdown(signal) {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  const forceTimeout = setTimeout(() => {
    logger.error('Forced shutdown timeout reached. Terminating process.');
    process.exit(1);
  }, 10000);
  forceTimeout.unref();

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      logger.info('HTTP server closed');
    }

    await disconnectDatabase();
    clearTimeout(forceTimeout);
    logger.info('Graceful shutdown completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error occurred during graceful shutdown', error);
    clearTimeout(forceTimeout);
    process.exit(1);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

bootstrap();
