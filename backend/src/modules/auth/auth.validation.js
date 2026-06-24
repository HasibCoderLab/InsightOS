import { z } from 'zod';
import ApiError from '../../utils/ApiError.js';

/**
 * Zod schemas for authentication
 */
const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(50).optional(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required when setting a new password',
      path: ['currentPassword'],
    }
  );

/**
 * Middleware factory to validate request body with a Zod schema
 * @param {z.ZodSchema} schema 
 * @returns {Function}
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return next(new ApiError(422, 'Validation failed', details));
    }
    next(error);
  }
};

export { registerSchema, loginSchema, updateProfileSchema, validate };
