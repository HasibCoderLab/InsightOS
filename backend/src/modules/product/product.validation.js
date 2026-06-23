import { z } from 'zod';
import ApiError from '../../utils/ApiError.js';

/**
 * Zod schemas for Product
 */
const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
});

const updateProductSchema = createProductSchema.partial();

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(1000).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

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

export { createProductSchema, updateProductSchema, querySchema, validate };
