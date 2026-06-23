import { z } from 'zod';
import ApiError from '../../utils/ApiError.js';

/**
 * Zod schemas for Sales
 */
const createSaleSchema = z.object({
  productId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid productId format',
  }),
  quantity: z.number().int().positive(),
  note: z.string().max(200).optional(),
  saleDate: z.string().datetime().optional().or(z.date().optional()),
});

const analyticsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
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

export { createSaleSchema, analyticsQuerySchema, validate };
