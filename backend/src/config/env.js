import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Environment variables schema validation
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  MONGODB_URI: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  AI_PROVIDER: z.string().default('gemini'),
  AI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
