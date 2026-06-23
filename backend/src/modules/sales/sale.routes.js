import express from 'express';
import { 
  saleController, 
  validate, 
  createSaleSchema, 
  analyticsQuerySchema 
} from './sale.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(createSaleSchema), saleController.createSale);
router.get('/analytics', validate(analyticsQuerySchema, 'query'), saleController.getAnalytics);
router.get('/', validate(analyticsQuerySchema, 'query'), saleController.getSales);
router.get('/:id', saleController.getSaleById);

export default router;
