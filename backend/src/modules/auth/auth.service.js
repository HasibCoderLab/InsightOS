import authRepository from './auth.repository.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.utils.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Service for authentication business logic
 */
const authService = {
  /**
   * Register a new user
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>}
   */
  async register(name, email, password) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'Email already exists');
    }

    const user = await authRepository.createUser({ name, email, password });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    await authRepository.updateRefreshToken(user._id, refreshToken);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  },

  /**
   * Login an existing user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>}
   */
  async login(email, password) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    await authRepository.updateRefreshToken(user._id, refreshToken);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  },

  /**
   * Refresh an access token
   * @param {string} refreshToken 
   * @returns {Promise<object>}
   */
  async refreshAccessToken(refreshToken) {
    const user = await authRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const accessToken = generateAccessToken(user._id, user.role);

    return { accessToken };
  },

  /**
   * Logout a user
   * @param {string} userId 
   * @returns {Promise<void>}
   */
  async logout(userId) {
    await authRepository.clearRefreshToken(userId);
  },

  /**
   * Update user profile (name and/or password)
   * @param {string} userId 
   * @param {object} updates 
   * @param {string} [updates.name] 
   * @param {string} [updates.currentPassword] 
   * @param {string} [updates.newPassword] 
   * @returns {Promise<object>}
   */
  async updateProfile(userId, { name, currentPassword, newPassword }) {
    const user = await authRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (newPassword) {
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        throw new ApiError(400, 'Current password incorrect');
      }

      // Set raw password — the pre-save hook handles bcrypt hashing
      user.password = newPassword;
    }

    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  },

  /**
   * Update user avatar
   * @param {string} userId
   * @param {string} avatarUrl
   * @returns {Promise<object>}
   */
  async updateAvatar(userId, avatarUrl) {
    const user = await authRepository.updateProfile(userId, { avatar: avatarUrl });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  },

  /**
   * Delete user avatar (reset to initials)
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async deleteAvatar(userId) {
    const user = await authRepository.updateProfile(userId, { avatar: null });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: null,
      createdAt: user.createdAt,
    };
  }
};

export default authService;
