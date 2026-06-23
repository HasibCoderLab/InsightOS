import express from 'express';
import userController from './user.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.delete('/data', authenticateToken, userController.clearAllData);
router.delete('/account', authenticateToken, userController.deleteAccount);

export default router;
