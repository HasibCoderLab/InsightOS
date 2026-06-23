import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import expenseService from './expense.service.js';
import { validate, createExpenseSchema, updateExpenseSchema } from './expense.validation.js';

/**
 * Controller for Expense operations
 */
const expenseController = {
  /**
   * Create an expense
   */
  createExpense: asyncHandler(async (req, res) => {
    const { user } = req;
    const expense = await expenseService.createExpense(user.userId, req.body);
    res.status(201).json(
      new ApiResponse(201, expense, 'Expense created successfully')
    );
  }),

  /**
   * Get paginated expenses
   */
  getExpenses: asyncHandler(async (req, res) => {
    const { user } = req;
    const result = await expenseService.getExpenses(user.userId, req.query);
    res.status(200).json(
      new ApiResponse(200, result, 'Expenses retrieved successfully')
    );
  }),

  /**
   * Get an expense by ID
   */
  getExpenseById: asyncHandler(async (req, res) => {
    const { user } = req;
    const expense = await expenseService.getExpenseById(user.userId, req.params.id);
    res.status(200).json(
      new ApiResponse(200, expense, 'Expense retrieved successfully')
    );
  }),

  /**
   * Update an expense
   */
  updateExpense: asyncHandler(async (req, res) => {
    const { user } = req;
    const expense = await expenseService.updateExpense(user.userId, req.params.id, req.body);
    res.status(200).json(
      new ApiResponse(200, expense, 'Expense updated successfully')
    );
  }),

  /**
   * Delete an expense
   */
  deleteExpense: asyncHandler(async (req, res) => {
    const { user } = req;
    const result = await expenseService.deleteExpense(user.userId, req.params.id);
    res.status(200).json(
      new ApiResponse(200, null, result.message)
    );
  }),

  /**
   * Get expense summary
   */
  getExpenseSummary: asyncHandler(async (req, res) => {
    const { user } = req;
    const summary = await expenseService.getExpenseSummary(user.userId, req.query);
    res.status(200).json(
      new ApiResponse(200, summary, 'Expense summary retrieved successfully')
    );
  }),
};

export { 
  expenseController, 
  validate, 
  createExpenseSchema, 
  updateExpenseSchema 
};
