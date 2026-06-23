import authService from './auth.service.js';
import authRepository from './auth.repository.js';
import { registerSchema, loginSchema, updateProfileSchema, validate } from './auth.validation.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Controller for auth operations
 */
const authController = {
  /**
   * Register a new user
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.register(name, email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json(
      new ApiResponse(201, { user, accessToken }, 'User registered successfully')
    );
  }),

  /**
   * Login an existing user
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json(
      new ApiResponse(200, { user, accessToken }, 'Login successful')
    );
  }),

  /**
   * Refresh access token
   */
  refresh: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required');
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    res.status(200).json(
      new ApiResponse(200, { accessToken }, 'Token refreshed successfully')
    );
  }),

  /**
   * Logout the user
   */
  logout: asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    await authService.logout(userId);

    res.clearCookie('refreshToken');
    res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully')
    );
  }),

  /**
   * Get current user profile
   */
  getCurrentUser: asyncHandler(async (req, res) => {
    const user = await authRepository.findById(req.user.userId);
    if (!user) throw new ApiError(404, 'User not found');

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(200).json(
      new ApiResponse(200, { user: userResponse }, 'User fetched')
    );
  }),

  /**
   * Update user profile (name and/or password)
   */
  updateProfile: [
    validate(updateProfileSchema),
    asyncHandler(async (req, res) => {
      const { name, currentPassword, newPassword } = req.body;
      const user = await authService.updateProfile(req.user.userId, {
        name,
        currentPassword,
        newPassword,
      });

      res.status(200).json(
        new ApiResponse(200, { user }, 'Profile updated successfully')
      );
    }),
  ],

  /**
   * Upload avatar
   */
  uploadAvatar: asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await authService.updateAvatar(req.user.userId, avatarUrl);

    res.status(200).json(
      new ApiResponse(200, { user }, 'Avatar uploaded successfully')
    );
  }),

  /**
   * Delete avatar (reset to initials)
   */
  deleteAvatar: asyncHandler(async (req, res) => {
    const user = await authService.deleteAvatar(req.user.userId);

    res.status(200).json(
      new ApiResponse(200, { user }, 'Avatar removed successfully')
    );
  }),
};

export { authController, validate, authenticateToken };
