import productRepository from '../product/product.repository.js';
import saleService from '../sales/sale.service.js';
import expenseService from '../expense/expense.service.js';

/**
 * Builder for AI prompts and context
 */
const promptBuilder = {
  /**
   * Build the system prompt for the AI
   * @returns {string}
   */
  buildSystemPrompt() {
    return `You are InsightOS, an AI business analyst assistant.
You have access to the user's real business data.
Your job:
- Analyze data accurately
- Give specific, actionable recommendations
- Use actual numbers from the provided data
- Be concise and practical
- If data is insufficient, say so clearly
- Respond in the same language the user writes in
  (Bengali or English)`;
  },

  /**
   * Build the business context from database data
   * @param {string} userId 
   * @returns {Promise<string>}
   */
  async buildBusinessContext(userId) {
    // Calculate dates for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const [
      products,
      saleAnalytics,
      expenseSummary
    ] = await Promise.all([
      this._getProductStats(userId),
      saleService.getAnalytics(userId, { startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
      expenseService.getExpenseSummary(userId, { startDate: startDate.toISOString(), endDate: endDate.toISOString() })
    ]);

    const {
      totalProducts,
      lowStockItems,
      outOfStockItems
    } = products;

    const {
      totalRevenue,
      totalTransactions,
      totalQuantity,
      topProducts,
      revenueByDay
    } = saleAnalytics;

    const {
      totalExpense,
      byCategory
    } = expenseSummary;

    // Calculate profit
    const netProfit = totalRevenue - totalExpense;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Calculate average order value
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // byCategory is an array of { _id: category, total: amount }, convert to string
    const expenseBreakdown = Array.isArray(byCategory)
      ? byCategory.map(c => `${c._id}: $${(c.total || 0).toFixed(2)}`).join(', ')
      : '';

    // Format top products
    const topProductsStr = topProducts
      .map(p => `${p.productName} ($${(p.revenue || 0).toFixed(2)})`)
      .join(', ');

    // Format low stock items
    const lowStockStr = lowStockItems
      .map(p => `${p.name} (${p.stock} units left)`)
      .join(', ');

    // Format out of stock items
    const outOfStockStr = outOfStockItems
      .map(p => p.name)
      .join(', ');

    return `=== BUSINESS DATA (Last 30 Days) ===

📦 INVENTORY:
- Total Products: ${totalProducts}
- Low Stock Items: ${lowStockStr || 'None'}
- Out of Stock: ${outOfStockStr || 'None'}

💰 REVENUE:
- Total: $${totalRevenue.toFixed(2)}
- Orders: ${totalTransactions}
- Avg Order Value: $${avgOrderValue.toFixed(2)}
- Top Products: ${topProductsStr || 'None'}

📉 EXPENSES:
- Total: $${totalExpense.toFixed(2)}
- Breakdown: ${expenseBreakdown || 'None'}

📊 PROFIT:
- Net Profit: $${netProfit.toFixed(2)}
- Profit Margin: ${profitMargin.toFixed(2)}%`;
  },

  /**
   * Private method to get product stats
   * @param {string} userId 
   * @private
   */
  async _getProductStats(userId) {
    const [totalProducts, lowStockProducts] = await Promise.all([
      productRepository.countByUser(userId),
      productRepository.findLowStock(userId)
    ]);

    const lowStockItems = lowStockProducts.map(p => ({
      name: p.name,
      stock: p.stock
    }));

    const outOfStockItems = lowStockProducts
      .filter(p => p.stock === 0)
      .map(p => p.name);

    return {
      totalProducts,
      lowStockItems,
      outOfStockItems
    };
  },

  /**
   * Convert DB messages to Gemini format
   * @param {Array<object>} messages 
   * @returns {Array<object>}
   */
  buildChatHistory(messages) {
    // Exclude last user message, as it goes as separate input
    return messages.slice(0, -1).map(msg => ({
      role: msg.role,        // 'user' or 'model'
      parts: [{ text: msg.content }]
    }));
  }
};

export default promptBuilder;
