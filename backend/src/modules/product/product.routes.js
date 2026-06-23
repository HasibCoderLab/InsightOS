import express from 'express';
import { 
  productController, 
  validate, 
  createProductSchema, 
  updateProductSchema, 
  querySchema 
} from './product.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(createProductSchema), productController.createProduct);
router.get('/', validate(querySchema, 'query'), productController.getProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProductById);
router.patch('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
