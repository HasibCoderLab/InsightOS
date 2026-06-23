import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('ERROR 💥', err);

  // Known operational errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      new ApiResponse(err.statusCode, null, err.message)
    );
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    return res.status(422).json(
      new ApiResponse(422, null, 'Validation failed')
    );
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json(
      new ApiResponse(400, null, 'Invalid ID format')
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      new ApiResponse(401, null, 'Invalid token')
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(
      new ApiResponse(401, null, 'Token expired')
    );
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json(
      new ApiResponse(409, null, 'Resource already exists')
    );
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json(
        new ApiResponse(400, null, 'File too large. Maximum size is 2MB')
      );
    }
    return res.status(400).json(
      new ApiResponse(400, null, err.message)
    );
  }

  // Unknown errors — hide internal details
  return res.status(500).json(
    new ApiResponse(500, null, 'Internal server error')
  );
};

export default errorHandler;
