const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check for liveness probe
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Readiness check for readiness probe
app.get('/ready', (req, res) => {
  // You can add more complex readiness checks here
  // like database connectivity, external service health, etc.
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple API endpoint
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Lumino Backend is running!',
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname(),
    pid: process.pid,
    memory: process.memoryUsage(),
    node_version: process.version
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lumino Backend API',
    endpoints: {
      health: '/health',
      ready: '/ready',
      status: '/api/status'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/health`);
  console.log(`Ready endpoint: http://localhost:${PORT}/ready`);
  console.log(`API endpoint: http://localhost:${PORT}/api/status`);
}); 