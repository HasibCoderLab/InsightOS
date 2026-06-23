import Expense from './expense.model.js';

/**
 * Repository for Expense data access
 */
const expenseRepository = {
  /**
   * Create a new expense
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async create(data) {
    const expense = new Expense(data);
    await expense.save();
    return expense;
  },

  /**
   * Find all expenses by user with filters
   * @param {string} userId 
   * @param {object} filters 
   * @returns {Promise<object>}
   */
  async findAllByUser(userId, { category, startDate, endDate, page = 1, limit = 10 }) {
    const query = { userId };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Expense.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      expenses,
      total,
      page: Number(page),
      totalPages,
    };
  },

  /**
   * Find an expense by ID and user
   * @param {string} expenseId 
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async findById(expenseId, userId) {
    return Expense.findOne({ _id: expenseId, userId });
  },

  /**
   * Update an expense by ID and user
   * @param {string} expenseId 
   * @param {string} userId 
   * @param {object} data 
   * @returns {Promise<object|null>}
   */
  async updateById(expenseId, userId, data) {
    return Expense.findOneAndUpdate(
      { _id: expenseId, userId },
      { $set: data },
      { returnDocument: 'after', runValidators: true }
    );
  },

  /**
   * Delete an expense by ID and user
   * @param {string} expenseId 
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async deleteById(expenseId, userId) {
    return Expense.findOneAndDelete({ _id: expenseId, userId });
  },

  /**
   * Get expense summary
   * @param {string} userId 
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {Promise<object>}
   */
  async getExpenseSummary(userId, startDate, endDate) {
    const query = { userId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const summary = await Expense.aggregate([
      { $match: query },
      {
        $facet: {
          totalExpense: [
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' },
              },
            },
          ],
          byCategory: [
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
              },
            },
          ],
          expenseByDay: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$date' },
                },
                total: { $sum: '$amount' },
              },
            },
            { $sort: { '_id': 1 } },
          ],
        },
      },
    ]);

    return {
      totalExpense: summary[0].totalExpense[0]?.total || 0,
      byCategory: summary[0].byCategory,
      expenseByDay: summary[0].expenseByDay,
    };
  },
};

export default expenseRepository;
