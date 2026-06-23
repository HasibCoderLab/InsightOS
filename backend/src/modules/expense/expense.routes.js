import express from 'express';
import { 
  expenseController, 
  validate, 
  createExpenseSchema, 
  updateExpenseSchema 
} from './expense.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(createExpenseSchema), expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/summary', expenseController.getExpenseSummary);
router.get('/:id', expenseController.getExpenseById);
router.patch('/:id', validate(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
