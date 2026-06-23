import express from 'express';
import { authController, validate } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.patch('/me', authenticateToken, authController.updateProfile);
router.post('/me/avatar', authenticateToken, upload.single('avatar'), authController.uploadAvatar);
router.delete('/me/avatar', authenticateToken, authController.deleteAvatar);

export default router;
