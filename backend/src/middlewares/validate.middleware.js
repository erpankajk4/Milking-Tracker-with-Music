import { AppError } from '../shared/errors/AppError.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message
      }));

      return next(new AppError('Request validation failed', 422, 'VALIDATION_ERROR', details));
    }

    req.body = parseResult.data;
    next();
  };
}
