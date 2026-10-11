import { Router } from 'express';
import { healthRouter } from '../modules/health/index.js';
import { sessionRouter } from '../modules/sessions/index.js';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/sessions', sessionRouter);

export { apiRouter };
