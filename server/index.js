require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database (with silent fallback to In-Memory mode if not running)
connectDB();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disabled CSP for inline assets & Chart.js CDN ease in dev
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', apiLimiter);

const fs = require('fs');

// Serve Static Frontend Assets & Uploaded Files
const clientPath = fs.existsSync(path.join(__dirname, '../client/index.html'))
  ? path.join(__dirname, '../client')
  : path.join(__dirname, '..');

app.use(express.static(clientPath));
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/screening', require('./routes/screeningRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// Fallback index.html for Single-Page Application (SPA) Routing
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = fs.existsSync(path.join(__dirname, '../client/index.html'))
    ? path.join(__dirname, '../client/index.html')
    : path.join(__dirname, '../index.html');
  res.sendFile(indexPath);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server if executed directly (e.g. npm start / node server/index.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
  =============================================================
  🚀 ANTI-GRAVITY AI RESUME SCREENING PLATFORM IS ONLINE!
  =============================================================
  ► Local Access:  http://localhost:${PORT}
  ► Environment:   ${process.env.NODE_ENV || 'development'}
  ► AI Engine:     ${process.env.OPENAI_API_KEY ? 'OpenAI GPT-4o Integration' : 'Built-in Rule-Based NLP Engine'}
  =============================================================
  `);
  });
}

module.exports = app;
