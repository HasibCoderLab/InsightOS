import Sale from '../sales/sale.model.js';
import Expense from '../expense/expense.model.js';
import Product from '../product/product.model.js';
import AIConversation from '../ai/ai.model.js';
import User from '../auth/auth.model.js';

/**
 * Service for user account management
 */
const userService = {
  /**
   * Clear all business data (sales, expenses, products) for a user
   * @param {string} userId
   * @returns {Promise<{deletedSales: number, deletedExpenses: number, deletedProducts: number}>}
   */
  async clearAllData(userId) {
    const [deletedSales, deletedExpenses, deletedProducts] = await Promise.all([
      Sale.deleteMany({ userId }),
      Expense.deleteMany({ userId }),
      Product.deleteMany({ userId }),
    ]);

    return {
      deletedSales: deletedSales.deletedCount,
      deletedExpenses: deletedExpenses.deletedCount,
      deletedProducts: deletedProducts.deletedCount,
    };
  },

  /**
   * Delete a user account and all associated data
   * Runs sequentially to maintain predictable order
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async deleteAccount(userId) {
    await Sale.deleteMany({ userId });
    await Expense.deleteMany({ userId });
    await Product.deleteMany({ userId });
    await AIConversation.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return true;
  },
};

export default userService;
