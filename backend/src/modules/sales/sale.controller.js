import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import saleService from './sale.service.js';
import { validate, createSaleSchema, analyticsQuerySchema } from './sale.validation.js';

/**
 * Controller for Sales operations
 */
const saleController = {
  /**
   * Create a sale
   */
  createSale: asyncHandler(async (req, res) => {
    const { user } = req;
    const sale = await saleService.createSale(user.userId, req.body);
    
    // Re-populate for the response
    const populatedSale = await sale.populate('productId', 'name');

    res.status(201).json(
      new ApiResponse(201, populatedSale, 'Sale created successfully')
    );
  }),

  /**
   * Get paginated sales
   */
  getSales: asyncHandler(async (req, res) => {
    const { user } = req;
    const result = await saleService.getSales(user.userId, req.query);
    res.status(200).json(
      new ApiResponse(200, result, 'Sales retrieved successfully')
    );
  }),

  /**
   * Get a sale by ID
   */
  getSaleById: asyncHandler(async (req, res) => {
    const { user } = req;
    const sale = await saleService.getSaleById(user.userId, req.params.id);
    res.status(200).json(
      new ApiResponse(200, sale, 'Sale retrieved successfully')
    );
  }),

  /**
   * Get sales analytics
   */
  getAnalytics: asyncHandler(async (req, res) => {
    const { user } = req;
    const analytics = await saleService.getAnalytics(user.userId, req.query);
    res.status(200).json(
      new ApiResponse(200, analytics, 'Sales analytics retrieved successfully')
    );
  }),
};

export { 
  saleController, 
  validate, 
  createSaleSchema, 
  analyticsQuerySchema 
};
