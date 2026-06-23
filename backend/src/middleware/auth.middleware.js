import { verifyAccessToken } from '../utils/token.utils.js';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Access token required'));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired access token'));
  }
};

/**
 * Middleware to authorize users based on roles
 * @param {...string} roles 
 * @returns {Function}
 */
export const authorizeRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Access denied'));
  }

  next();
};
