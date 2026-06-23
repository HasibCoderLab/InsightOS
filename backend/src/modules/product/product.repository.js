import Product from './product.model.js';

/**
 * Repository for Product data access
 */
const productRepository = {
  /**
   * Create a new product
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async create(data) {
    const product = new Product(data);
    await product.save();
    return product;
  },

  /**
   * Find all products by user with filters
   * @param {string} userId 
   * @param {object} filters 
   * @returns {Promise<object>}
   */
  async findAllByUser(userId, { category, search, page = 1, limit = 10 }) {
    const query = { userId };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page: Number(page),
      totalPages,
    };
  },

  /**
   * Find a product by ID and user
   * @param {string} productId 
   * @param {string} userId 
   * @param {import('mongoose').ClientSession} [session]
   * @returns {Promise<object|null>}
   */
  async findById(productId, userId, session = null) {
    return Product.findOne({ _id: productId, userId }).session(session);
  },

  /**
   * Update a product by ID and user
   * @param {string} productId 
   * @param {string} userId 
   * @param {object} data 
   * @param {import('mongoose').ClientSession} [session]
   * @returns {Promise<object|null>}
   */
  async updateById(productId, userId, data, session = null) {
    return Product.findOneAndUpdate(
      { _id: productId, userId },
      { $set: data },
      { returnDocument: 'after', runValidators: true, session }
    );
  },

  /**
   * Delete a product by ID and user
   * @param {string} productId 
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async deleteById(productId, userId) {
    return Product.findOneAndDelete({ _id: productId, userId });
  },

  /**
   * Find products with low stock
   * @param {string} userId 
   * @returns {Promise<object[]>}
   */
  async findLowStock(userId) {
    return Product.find({ userId, $expr: { $lte: ['$stock', '$lowStockThreshold'] } });
  },

  /**
   * Find a product by name for a user to check duplicates
   * @param {string} userId 
   * @param {string} name 
   * @returns {Promise<object|null>}
   */
  async findByName(userId, name) {
    return Product.findOne({ userId, name });
  },

  /**
   * Decrement product stock atomically within a transaction
   * @param {string} productId 
   * @param {string} userId 
   * @param {number} quantity 
   * @param {import('mongoose').ClientSession} session 
   * @returns {Promise<object|null>}
   */
  async decrementStock(productId, userId, quantity, session) {
    return Product.findOneAndUpdate(
      { _id: productId, userId, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true, session }
    );
  },

  /**
   * Count total products for a user
   * @param {string} userId 
   * @returns {Promise<number>}
   */
  async countByUser(userId) {
    return Product.countDocuments({ userId });
  }
};

export default productRepository;
