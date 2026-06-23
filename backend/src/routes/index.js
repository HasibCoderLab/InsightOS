import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import productRoutes from '../modules/product/product.routes.js';
import saleRoutes from '../modules/sales/sale.routes.js';
import expenseRoutes from '../modules/expense/expense.routes.js';
import aiRoutes from '../modules/ai/ai.routes.js';
import userRoutes from '../modules/user/user.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/expenses', expenseRoutes);
router.use('/ai', aiRoutes);
router.use('/user', userRoutes);

export default router;
