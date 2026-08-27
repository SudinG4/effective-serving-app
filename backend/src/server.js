import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// Middleware
// ----------------------------

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ----------------------------
// Routes
// ----------------------------

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the WellBeingCheck API'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WellBeingCheck backend is running',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------
// API 404
// ----------------------------

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// ----------------------------
// Global Error Handler
// ----------------------------

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ----------------------------
// Start Server
// ----------------------------

const server = app.listen(PORT, () => {
  console.log('');
  console.log('---------------------------------------');
  console.log(' WellBeingCheck Backend');
  console.log('---------------------------------------');
  console.log(` Server: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log('---------------------------------------');
  console.log('');
});

// Keep track of server errors
server.on('error', (error) => {
  console.error('Failed to start server:', error);
});