import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import env from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
fs.mkdirSync(avatarsDir, { recursive: true });

/**
 * Express application configuration and middleware setup
 */
const app = express();

// Cookie parser (needed for refresh token cookie)
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
const sanitize = (req, res, next) => {
  const sanitizeObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeObj(obj[key]);
      }
    });
    return obj;
  };
  if (req.body) sanitizeObj(req.body);
  next();
};
app.use(sanitize);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is working' });
});

// Handle undefined routes
app.use(notFound);

// Handle global errors
app.use(errorHandler);

export default app;
