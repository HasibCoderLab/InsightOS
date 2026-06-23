import productRepository from './product.repository.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Service for Product business logic
 */
const productService = {
  /**
   * Create a product
   * @param {string} userId 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async createProduct(userId, data) {
    const existingProduct = await productRepository.findByName(userId, data.name);
    if (existingProduct) {
      throw new ApiError(409, 'Product name already exists for this user');
    }

    return productRepository.create({ ...data, userId });
  },

  /**
   * Get paginated products for a user
   * @param {string} userId 
   * @param {object} query 
   * @returns {Promise<object>}
   */
  async getProducts(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const category = query.category;
    const search = query.search;

    return productRepository.findAllByUser(userId, { category, search, page, limit });
  },

  /**
   * Get a product by ID
   * @param {string} userId 
   * @param {string} productId 
   * @returns {Promise<object>}
   */
  async getProductById(userId, productId) {
    const product = await productRepository.findById(productId, userId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  },

  /**
   * Update a product
   * @param {string} userId 
   * @param {string} productId 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async updateProduct(userId, productId, data) {
    if (data.name) {
      const existingProduct = await productRepository.findByName(userId, data.name);
      if (existingProduct && existingProduct._id.toString() !== productId) {
        throw new ApiError(409, 'Product name already exists for this user');
      }
    }

    const product = await productRepository.updateById(productId, userId, data);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  },

  /**
   * Delete a product
   * @param {string} userId 
   * @param {string} productId 
   * @returns {Promise<object>}
   */
  async deleteProduct(userId, productId) {
    const product = await productRepository.deleteById(productId, userId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return { message: 'Product deleted successfully' };
  },

  /**
   * Get low stock products
   * @param {string} userId 
   * @returns {Promise<object[]>}
   */
  async getLowStockProducts(userId) {
    return productRepository.findLowStock(userId);
  },
};

export default productService;
