require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cron = require('node-cron');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const seed = require('./services/seeder');
const { detectOverdue } = require('./services/overdueService');
const logger = require('./utils/logger');
const { connectRedis } = require('./services/redisService');

// Only initialize BullMQ worker outside serverless environments
if (!process.env.VERCEL) {
  try {
    require('./workers/reportWorker');
  } catch (e) {
    console.warn('[Worker] BullMQ Worker failed to load (Redis likely unavailable):', e.message);
  }
}

// Route imports
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const loanRoutes = require('./routes/loanRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const auditRoutes = require('./routes/auditRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();

// Security Middleware
app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://pahel-micro-finance-eoko.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// HTTP Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// On Vercel: ensure DB/Redis are connected before handling requests
if (process.env.VERCEL) {
  const vercelDbReady = connectDB();
  connectRedis();
  app.use(async (req, res, next) => {
    await vercelDbReady;
    next();
  });
}

// Health check (before route imports to be always available)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Pahel LMS API is running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/groups', groupRoutes);

// Backend API only - Frontend is deployed separately on Vercel

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error Handler
app.use(errorHandler);

// Connect DB, Redis and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[Startup] Connecting to MongoDB...');
    await connectDB();
    console.log('[Startup] MongoDB connected.');

    console.log('[Startup] Connecting to Redis...');
    connectRedis(); // Don't await, let it connect in background
    console.log('[Startup] Redis connection initiated.');

    // Seed initial data
    console.log('[Startup] Running seeder...');
    await seed();
    console.log('[Startup] Seeder complete.');

    app.listen(PORT, () => {
      logger.info(`Pahel LMS Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      logger.info(`API: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}/api/health`);
    });

    // Cron: detect overdue EMIs daily at midnight
    cron.schedule('0 0 * * *', async () => {
      logger.info('[CRON] Running overdue detection...');
      await detectOverdue();
    });

    process.on('unhandledRejection', (reason) => {
      if (reason && (reason.code === 'ECONNREFUSED' || reason.message?.includes('ECONNREFUSED'))) {
        return;
      }
      logger.error('Unhandled Rejection', reason);
    });

    process.on('uncaughtException', (err) => {
      if (err && (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED'))) {
        return;
      }
      logger.error('Uncaught Exception', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

// On Vercel, export app only; serverless handles requests per-invocation
if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;
