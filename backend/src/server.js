require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const guidelineRoutes = require('./routes/guidelineRoutes');
const terminologyRoutes = require('./routes/terminologyRoutes');
const factRoutes = require('./routes/factRoutes');
const brandAssetRoutes = require('./routes/brandAssetRoutes');
const contentRoutes = require('./routes/contentRoutes');
const findingRoutes = require('./routes/findingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

// Connect to Database
connectDB();

// Body parser
app.use(express.json());

// Dev logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Always allow official domains
const standardOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://inkloomguard.xyz',
  'https://www.inkloomguard.xyz'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (standardOrigins.includes(origin) || allowedOrigins.includes(origin) || origin.endsWith('.inkloomguard.xyz') || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev to avoid CORS blocking during demos
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Status & Branding Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Inkloom AI',
    brandIdentity: 'InkloomGuard',
    domain: 'https://inkloomguard.xyz',
    tagline: 'Intelligent Brand Governance',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/guidelines', guidelineRoutes);
app.use('/api/terminology', terminologyRoutes);
app.use('/api/facts', factRoutes);
app.use('/api/assets', brandAssetRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/findings', findingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  INKLOOM AI - Intelligent Brand Governance Platform  `);
    console.log(`  Brand Identity: InkloomGuard | https://inkloomguard.xyz `);
    console.log(`  Backend Server running on port ${PORT}               `);
    console.log(`=======================================================`);
  });
}

module.exports = app;
