import saleRepository from './sale.repository.js';
import productRepository from '../product/product.repository.js';
import mongoose from 'mongoose';
import ApiError from '../../utils/ApiError.js';

/**
 * Service for Sales business logic
 */
const saleService = {
  /**
   * Create a sale
   * @param {string} userId 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async createSale(userId, data) {
    const { productId, quantity } = data;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const product = await productRepository.findById(productId, userId, session);
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      if (product.stock < quantity) {
        throw new ApiError(400, 'Insufficient stock');
      }

      const totalAmount = quantity * product.price;
      const unitPrice = product.price;

      // Atomically decrement stock inside the transaction
      const updatedProduct = await productRepository.decrementStock(productId, userId, quantity, session);
      if (!updatedProduct) {
        throw new ApiError(400, 'Insufficient stock');
      }

      const sale = await saleRepository.create({
        userId,
        productId,
        quantity,
        unitPrice,
        totalAmount,
        note: data.note,
        saleDate: data.saleDate,
      }, session);

      await session.commitTransaction();

      return sale;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get paginated sales
   * @param {string} userId 
   * @param {object} query 
   * @returns {Promise<object>}
   */
  async getSales(userId, query) {
    const { startDate, endDate, productId, page, limit } = query;
    return saleRepository.findAllByUser(userId, { startDate, endDate, productId, page, limit });
  },

  /**
   * Get a sale by ID
   * @param {string} userId 
   * @param {string} saleId 
   * @returns {Promise<object>}
   */
  async getSaleById(userId, saleId) {
    const sale = await saleRepository.findById(saleId, userId);
    if (!sale) {
      throw new ApiError(404, 'Sale not found');
    }
    return sale;
  },

  /**
   * Get sales analytics
   * @param {string} userId 
   * @param {object} query 
   * @returns {Promise<object>}
   */
  async getAnalytics(userId, query) {
    const { startDate, endDate } = query;
    
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();

    // Default to last 30 days if not provided
    if (!startDate && !endDate) {
      start = new Date();
      start.setDate(start.getDate() - 30);
      end = new Date();
    }

    return saleRepository.getAnalytics(userId, start, end);
  },
};

export default saleService;
