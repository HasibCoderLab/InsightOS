import Sale from './sale.model.js';

/**
 * Repository for Sale data access
 */
const saleRepository = {
  /**
   * Create a new sale
   * @param {object} data 
   * @param {import('mongoose').ClientSession} [session]
   * @returns {Promise<object>}
   */
  async create(data, session = null) {
    const sale = new Sale(data);
    if (session) {
      await sale.save({ session });
    } else {
      await sale.save();
    }
    return sale;
  },

  /**
   * Find all sales by user with filters
   * @param {string} userId 
   * @param {object} filters 
   * @returns {Promise<object>}
   */
  async findAllByUser(userId, { startDate, endDate, productId, page = 1, limit = 10 }) {
    const query = { userId };

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) {
        query.saleDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.saleDate.$lte = new Date(endDate);
      }
    }

    if (productId) {
      query.productId = productId;
    }

    const skip = (page - 1) * limit;
    const [sales, total] = await Promise.all([
      Sale.find(query).sort({ saleDate: -1 }).skip(skip).limit(limit).populate('productId', 'name'),
      Sale.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      sales,
      total,
      page: Number(page),
      totalPages,
    };
  },

  /**
   * Find a sale by ID and user
   * @param {string} saleId 
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async findById(saleId, userId) {
    return Sale.findOne({ _id: saleId, userId }).populate('productId', 'name');
  },

  /**
   * Get sales analytics
   * @param {string} userId 
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns {Promise<object>}
   */
  async getAnalytics(userId, startDate, endDate) {
    const query = { userId };
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = startDate;
      if (endDate) query.saleDate.$lte = endDate;
    }

    const analytics = await Sale.aggregate([
      { $match: query },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalQuantity: { $sum: '$quantity' },
                totalTransactions: { $sum: 1 },
              },
            },
          ],
          revenueByDay: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$saleDate' },
                },
                revenue: { $sum: '$totalAmount' },
              },
            },
            { $sort: { '_id': 1 } },
          ],
          topProducts: [
            {
              $group: {
                _id: '$productId',
                revenue: { $sum: '$totalAmount' },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
              },
            },
            { $unwind: '$product' },
            {
              $project: {
                _id: 0,
                productId: '$_id',
                productName: '$product.name',
                revenue: 1,
              },
            },
          ],
        },
      },
    ]);

    const summary = analytics[0].summary[0] || {
      totalRevenue: 0,
      totalQuantity: 0,
      totalTransactions: 0,
    };

    return {
      totalRevenue: summary.totalRevenue,
      totalQuantity: summary.totalQuantity,
      totalTransactions: summary.totalTransactions,
      revenueByDay: analytics[0].revenueByDay,
      topProducts: analytics[0].topProducts,
    };
  },
};

export default saleRepository;
