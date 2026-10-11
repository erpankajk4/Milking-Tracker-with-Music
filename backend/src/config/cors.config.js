import cors from 'cors';
import { env } from './env.config.js';

const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim());

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow server-to-server or non-browser requests without origin header
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
});
