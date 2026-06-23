import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import productService from './product.service.js';
import { validate, createProductSchema, updateProductSchema, querySchema } from './product.validation.js';

/**
 * Controller for Product operations
 */
const productController = {
  /**
   * Create a product
   */
  createProduct: asyncHandler(async (req, res) => {
    const { user } = req;
    const product = await productService.createProduct(user.userId, req.body);
    res.status(201).json(
      new ApiResponse(201, product, 'Product created successfully')
    );
  }),

  /**
   * Get paginated products
   */
  getProducts: asyncHandler(async (req, res) => {
    const { user } = req;
    const result = await productService.getProducts(user.userId, req.query);
    res.status(200).json(
      new ApiResponse(200, result, 'Products retrieved successfully')
    );
  }),

  /**
   * Get a product by ID
   */
  getProductById: asyncHandler(async (req, res) => {
    const { user } = req;
    const product = await productService.getProductById(user.userId, req.params.id);
    res.status(200).json(
      new ApiResponse(200, product, 'Product retrieved successfully')
    );
  }),

  /**
   * Update a product
   */
  updateProduct: asyncHandler(async (req, res) => {
    const { user } = req;
    const product = await productService.updateProduct(user.userId, req.params.id, req.body);
    res.status(200).json(
      new ApiResponse(200, product, 'Product updated successfully')
    );
  }),

  /**
   * Delete a product
   */
  deleteProduct: asyncHandler(async (req, res) => {
    const { user } = req;
    const result = await productService.deleteProduct(user.userId, req.params.id);
    res.status(200).json(
      new ApiResponse(200, null, result.message)
    );
  }),

  /**
   * Get low stock products
   */
  getLowStockProducts: asyncHandler(async (req, res) => {
    const { user } = req;
    const products = await productService.getLowStockProducts(user.userId);
    res.status(200).json(
      new ApiResponse(200, products, 'Low stock products retrieved successfully')
    );
  }),
};

export { 
  productController, 
  validate, 
  createProductSchema, 
  updateProductSchema, 
  querySchema 
};
