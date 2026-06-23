import expenseRepository from './expense.repository.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Service for Expense business logic
 */
const expenseService = {
  /**
   * Create an expense
   * @param {string} userId 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async createExpense(userId, data) {
    return expenseRepository.create({ ...data, userId });
  },

  /**
   * Get paginated expenses
   * @param {string} userId 
   * @param {object} query 
   * @returns {Promise<object>}
   */
  async getExpenses(userId, query) {
    const { category, startDate, endDate, page, limit } = query;
    return expenseRepository.findAllByUser(userId, { category, startDate, endDate, page, limit });
  },

  /**
   * Get an expense by ID
   * @param {string} userId 
   * @param {string} expenseId 
   * @returns {Promise<object>}
   */
  async getExpenseById(userId, expenseId) {
    const expense = await expenseRepository.findById(expenseId, userId);
    if (!expense) {
      throw new ApiError(404, 'Expense not found');
    }
    return expense;
  },

  /**
   * Update an expense
   * @param {string} userId 
   * @param {string} expenseId 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async updateExpense(userId, expenseId, data) {
    const expense = await expenseRepository.updateById(expenseId, userId, data);
    if (!expense) {
      throw new ApiError(404, 'Expense not found');
    }
    return expense;
  },

  /**
   * Delete an expense
   * @param {string} userId 
   * @param {string} expenseId 
   * @returns {Promise<object>}
   */
  async deleteExpense(userId, expenseId) {
    const expense = await expenseRepository.deleteById(expenseId, userId);
    if (!expense) {
      throw new ApiError(404, 'Expense not found');
    }
    return { message: 'Expense deleted successfully' };
  },

  /**
   * Get expense summary
   * @param {string} userId 
   * @param {object} query 
   * @returns {Promise<object>}
   */
  async getExpenseSummary(userId, query) {
    const { startDate, endDate } = query;

    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // Default to last 30 days if not provided
    if (!startDate && !endDate) {
      start = new Date();
      start.setDate(start.getDate() - 30);
      end = new Date();
    }

    return expenseRepository.getExpenseSummary(userId, start, end);
  },
};

export default expenseService;
