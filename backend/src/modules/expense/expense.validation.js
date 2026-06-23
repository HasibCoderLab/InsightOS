import { z } from 'zod';
import ApiError from '../../utils/ApiError.js';

/**
 * Zod schemas for Expense
 */
const createExpenseSchema = z.object({
  title: z.string().min(1).max(100),
  amount: z.number().positive(),
  category: z.enum([
    'rent',
    'salary',
    'utilities',
    'marketing',
    'supplies',
    'transport',
    'maintenance',
    'other',
  ]),
  note: z.string().max(200).optional(),
  date: z.string().datetime().optional().or(z.date().optional()),
});

const updateExpenseSchema = createExpenseSchema.partial();

/**
 * Middleware factory to validate request body/query with a Zod schema
 * @param {z.ZodSchema} schema 
 * @param {'body' | 'query'} location 
 * @returns {Function}
 */
const validate = (schema, location = 'body') => (req, res, next) => {
  try {
    const data = location === 'query' ? req.query : req.body;
    schema.parse(data);
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

export { createExpenseSchema, updateExpenseSchema, validate };
