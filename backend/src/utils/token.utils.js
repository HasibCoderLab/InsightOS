import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

/**
 * Generates an access token
 * @param {string} userId 
 * @param {string} role 
 * @returns {string}
 */
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

/**
 * Generates a refresh token
 * @param {string} userId 
 * @returns {string}
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Verifies an access token
 * @param {string} token 
 * @returns {object} decoded payload
 * @throws {ApiError}
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid access token');
  }
};

/**
 * Verifies a refresh token
 * @param {string} token 
 * @returns {object} decoded payload
 * @throws {ApiError}
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
};
