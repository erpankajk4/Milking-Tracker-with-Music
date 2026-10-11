import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(9041),
  MONGO_URI: z.string().refine(
    (uri) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'),
    { message: 'MONGO_URI must begin with mongodb:// or mongodb+srv://' }
  ),
  CLIENT_ORIGIN: z.string().min(1).default('http://localhost:9040')
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  const issues = parseResult.error.issues.map(
    (issue) => `  - ${issue.path.join('.')}: ${issue.message}`
  ).join('\n');
  console.error(`Invalid environment variables:\n${issues}`);
  process.exit(1);
}

export const env = Object.freeze(parseResult.data);
