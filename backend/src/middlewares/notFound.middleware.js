import { AppError } from '../shared/errors/AppError.js';

export function notFoundMiddleware(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
}
