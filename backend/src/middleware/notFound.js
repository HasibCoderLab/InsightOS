import ApiError from '../utils/ApiError.js';

/**
 * Middleware to handle 404 Not Found
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
};

export default notFound;
