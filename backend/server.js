const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const { seedDatabase } = require('./database/initDb');

// Import routes
const authRoutes = require('./routes/authRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const eligibilityRoutes = require('./routes/eligibilityRoutes');
const profileRoutes = require('./routes/profileRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const articleRoutes = require('./routes/articleRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve sample static documents / logos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check & Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EduScholar Discovery Platform API',
    database_engine: db.getEngine()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', articleRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Connecting to database...');
    await db.initDatabase();
    // Ensure tables and seed data exist
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 EduScholar Backend API running on http://localhost:${PORT}`);
      console.log(`📡 Database Engine in use: [${db.getEngine().toUpperCase()}]`);
      console.log(`🔑 Demo Accounts:`);
      console.log(`   - Student: student@eduscholar.org / Student@123`);
      console.log(`   - Admin:   admin@eduscholar.org / Admin@123`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
