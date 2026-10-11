import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './config/cors.config.js';
import { apiRouter } from './routes/index.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '20kb' }));

app.use(apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
