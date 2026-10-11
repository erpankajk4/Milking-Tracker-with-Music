import { Router } from 'express';
import { sessionController } from './session.controller.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { createSessionSchema } from './session.schema.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

const sessionRouter = Router();

sessionRouter.post(
  '/',
  validateBody(createSessionSchema),
  asyncHandler(sessionController.createSession)
);

sessionRouter.get(
  '/',
  asyncHandler(sessionController.getSessions)
);

export { sessionRouter };
