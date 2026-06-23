import User from './auth.model.js';

/**
 * Repository for User data access
 */
const authRepository = {
  /**
   * Create a new user
   * @param {object} userData 
   * @returns {Promise<object>}
   */
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  },

  /**
   * Find user by email
   * @param {string} email 
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  },

  /**
   * Find user by ID
   * @param {string} id 
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    return User.findById(id);
  },

  /**
   * Update user's refresh token
   * @param {string} userId 
   * @param {string} token 
   * @returns {Promise<void>}
   */
  async updateRefreshToken(userId, token) {
    await User.findByIdAndUpdate(userId, { refreshToken: token });
  },

  /**
   * Find user by refresh token
   * @param {string} token 
   * @returns {Promise<object|null>}
   */
  async findByRefreshToken(token) {
    return User.findOne({ refreshToken: token });
  },

  /**
   * Clear user's refresh token
   * @param {string} userId 
   * @returns {Promise<void>}
   */
  async clearRefreshToken(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  },

  /**
   * Find user by ID with password field selected
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async findByIdWithPassword(userId) {
    return User.findById(userId).select('+password');
  },

  /**
   * Update user profile
   * @param {string} userId 
   * @param {object} updateData 
   * @returns {Promise<object|null>}
   */
  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return user;
  }
};

export default authRepository;
