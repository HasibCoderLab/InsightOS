import userService from './user.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

/**
 * Controller for user account operations
 */
const userController = {
  /**
   * Clear all business data for the authenticated user
   */
  clearAllData: asyncHandler(async (req, res) => {
    const result = await userService.clearAllData(req.user.userId);

    res.status(200).json(
      new ApiResponse(200, result, 'All business data cleared')
    );
  }),

  /**
   * Delete the authenticated user's account and all associated data
   */
  deleteAccount: asyncHandler(async (req, res) => {
    await userService.deleteAccount(req.user.userId);

    res.clearCookie('refreshToken');

    res.status(200).json(
      new ApiResponse(200, null, 'Account deleted')
    );
  }),
};

export default userController;
