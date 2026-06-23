import express from 'express';
import rateLimit from 'express-rate-limit';
import aiController from './ai.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

// AI Rate Limiting: max 20 requests per user per hour
const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'AI request limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authenticateToken);
router.use(aiRateLimit);

router.post('/chat', aiController.chat);
router.get('/conversations', aiController.getConversations);
router.get('/conversations/:id', aiController.getConversationById);
router.delete('/conversations/:id', aiController.deleteConversation);

export default router;
