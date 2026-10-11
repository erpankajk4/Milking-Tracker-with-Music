import { env } from '../config/env.config.js';
import { logger } from '../shared/logger/logger.js';
import { AppError } from '../shared/errors/AppError.js';

export function errorHandlerMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Handle syntax error (e.g. malformed JSON body)
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'Invalid JSON payload received',
        details: []
      }
    });
  }

  // Handle entity too large (payload size)
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload exceeded maximum size limit',
        details: []
      }
    });
  }

  // Handle operational AppError
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || []
      }
    });
  }

  // Unexpected / Internal server errors
  logger.error('Unexpected server error', err);

  const statusCode = 500;
  const isProduction = env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProduction ? 'An unexpected server error occurred' : err.message,
      details: isProduction ? [] : [{ stack: err.stack }]
    }
  });
}
