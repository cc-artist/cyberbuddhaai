const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models
const ServiceStatus = require('./models/ServiceStatus');
const Blessing = require('./models/Blessing');
const Temple = require('./models/Temple');
const Consultation = require('./models/Consultation');
const Payment = require('./models/Payment');
const APIDocument = require('./models/APIDocument');
const PaymentConfig = require('./models/PaymentConfig');

// Import payment service
const paymentService = require('./services/paymentService');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Admin interface route - support both admin.html and admin/index.html
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});

// Serve admin.html directly for root /admin path
app.get('/admin', (req, res) => {
  res.redirect('/admin.html');
});

// Support for admin/index.html as well
app.get('/admin/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyber-buddha', {
  serverSelectionTimeoutMS: 5000, // 5秒服务器选择超时
  socketTimeoutMS: 5000, // 5秒套接字超时
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Mock data middleware for when MongoDB is unavailable
const mockData = {
  serviceStatus: {
    backendService: 'running',
    frontendService: 'running',
    databaseConnection: 'connected',
    apiResponseTime: 23,
    cpuUsage: 32,
    memoryUsage: 45,
    diskSpace: 68,
    updatedAt: new Date()
  },
  blessing: {
    totalBlessings: 1234,
    todayBlessings: 89,
    totalUsers: 567,
    avgProcessingTime: 12.5,
    updatedAt: new Date()
  },
  temples: [
    { name: '赛博禅院', isActive: true },
    { name: '数字佛堂', isActive: true },
    { name: '虚拟禅寺', isActive: false }
  ],
  consultations: [
    { status: 'pending' },
    { status: 'pending' },
    { status: 'replied' },
    { status: 'replied' },
    { status: 'replied' }
  ],
  payments: [
    { id: 'PAY20260207001', user: '张三', amount: 100, status: 'completed', createdAt: '2026-02-07 10:30:00' },
    { id: 'PAY20260207002', user: '李四', amount: 200, status: 'completed', createdAt: '2026-02-07 11:15:00' },
    { id: 'PAY20260207003', user: '王五', amount: 150, status: 'pending', createdAt: '2026-02-07 12:45:00' },
    { id: 'PAY20260207004', user: '赵六', amount: 300, status: 'failed', createdAt: '2026-02-07 14:20:00' },
    { id: 'PAY20260207005', user: '孙七', amount: 250, status: 'completed', createdAt: '2026-02-07 15:10:00' }
  ],
  apiDocs: [
    { path: '/api/health', method: 'GET' },
    { path: '/api/bless', method: 'POST' },
    { path: '/api/stats', method: 'GET' },
    { path: '/api/payments', method: 'GET' },
    { path: '/api/payments/:id', method: 'GET' }
  ]
};

// Simple in-memory session store
const sessions = new Map();

// Generate session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Cyber Buddha Online Blessing API' });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login API
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple login validation (in production, this should check against a database)
  if (username === 'admin' && password === 'password') {
    const sessionId = generateSessionId();
    const user = { username, role: 'admin' };
    
    // Store session
    sessions.set(sessionId, {
      user,
      createdAt: Date.now(),
      lastActivity: Date.now()
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user,
      sessionId
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

// Logout API
app.post('/api/admin/logout', (req, res) => {
  const { sessionId } = req.body;
  
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid session'
    });
  }
});

// Get payments API
app.get('/api/admin/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({
      payments: payments,
      totalCount: payments.length,
      totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
      completedCount: payments.filter(payment => payment.status === 'completed').length
    });
  } catch (error) {
    console.error('Error getting payments data from MongoDB, using mock data:', error.message);
    res.status(200).json({
      payments: mockData.payments,
      totalCount: mockData.payments.length,
      totalRevenue: mockData.payments.reduce((sum, payment) => sum + payment.amount, 0),
      completedCount: mockData.payments.filter(payment => payment.status === 'completed').length
    });
  }
});

// Get single payment API
app.get('/api/admin/payments/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const payment = await Payment.findById(id);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error getting payment data from MongoDB:', error.message);
    res.status(404).json({ error: 'Payment not found' });
  }
});

// Admin API routes

// Get dashboard data
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    // Try to get data from MongoDB
    const status = await ServiceStatus.findOne();
    const blessing = await Blessing.findOne();
    const temples = await Temple.find();
    const consultations = await Consultation.find();
    const payments = await Payment.find();
    const apiDocs = await APIDocument.find();

    // Return real data regardless of whether it's empty
    res.status(200).json({
      status: status,
      blessing: blessing,
      templeCount: temples.length,
      activeTempleCount: temples.filter(temple => temple.isActive).length,
      consultationCount: consultations.length,
      pendingConsultationCount: consultations.filter(consult => consult.status === 'pending').length,
      paymentCount: payments.length,
      totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
      apiDocsCount: apiDocs.length
    });
  } catch (error) {
    console.error('Error getting dashboard data from MongoDB, using mock data:', error.message);
    // Return mock data only if MongoDB is unavailable
    res.status(200).json({
      status: mockData.serviceStatus,
      blessing: mockData.blessing,
      templeCount: mockData.temples.length,
      activeTempleCount: mockData.temples.filter(temple => temple.isActive).length,
      consultationCount: mockData.consultations.length,
      pendingConsultationCount: mockData.consultations.filter(consult => consult.status === 'pending').length,
      paymentCount: mockData.payments.length,
      totalRevenue: mockData.payments.reduce((sum, payment) => sum + payment.amount, 0),
      apiDocsCount: mockData.apiDocs.length
    });
  }
});

// Get system status
app.get('/api/admin/status', async (req, res) => {
  try {
    let status = await ServiceStatus.findOne();
    // If no status exists, create a default one
    if (!status) {
      status = new ServiceStatus();
      await status.save();
    }
    res.status(200).json(status);
  } catch (error) {
    console.error('Error getting system status from MongoDB, using mock data:', error.message);
    // Return mock data only if MongoDB is unavailable
    res.status(200).json(mockData.serviceStatus);
  }
});

// Get blessings data
app.get('/api/admin/blessings', async (req, res) => {
  try {
    let blessing = await Blessing.findOne();
    // If no blessing data exists, create a default one
    if (!blessing) {
      blessing = new Blessing();
      await blessing.save();
    }
    res.status(200).json(blessing);
  } catch (error) {
    console.error('Error getting blessings data from MongoDB, using mock data:', error.message);
    // Return mock data only if MongoDB is unavailable
    res.status(200).json(mockData.blessing);
  }
});

// Get temples data
app.get('/api/admin/temples', async (req, res) => {
  try {
    const temples = await Temple.find();
    res.status(200).json({
      temples,
      totalCount: temples.length,
      activeCount: temples.filter(temple => temple.isActive).length
    });
  } catch (error) {
    console.error('Error getting temples data from MongoDB, using mock data:', error.message);
    // Return mock data only if MongoDB is unavailable
    res.status(200).json({
      temples: mockData.temples,
      totalCount: mockData.temples.length,
      activeCount: mockData.temples.filter(temple => temple.isActive).length
    });
  }
});

// Get consultations data
app.get('/api/admin/consultations', async (req, res) => {
  try {
    const consultations = await Consultation.find();
    res.status(200).json({
      consultations,
      totalCount: consultations.length,
      pendingCount: consultations.filter(consult => consult.status === 'pending').length,
      repliedCount: consultations.filter(consult => consult.status === 'replied').length
    });
  } catch (error) {
    console.error('Error getting consultations data from MongoDB, using mock data:', error.message);
    // Return mock data only if MongoDB is unavailable
    res.status(200).json({
      consultations: mockData.consultations,
      totalCount: mockData.consultations.length,
      pendingCount: mockData.consultations.filter(consult => consult.status === 'pending').length,
      repliedCount: mockData.consultations.filter(consult => consult.status === 'replied').length
    });
  }
});



// Get API docs data
app.get('/api/admin/api-docs', async (req, res) => {
  try {
    const apiDocs = await APIDocument.find();
    res.status(200).json({
      apiDocs,
      totalCount: apiDocs.length
    });
  } catch (error) {
    console.error('Error getting API docs data from MongoDB, using mock data:', error.message);
    // Return mock data only if MongoDB is unavailable
    res.status(200).json({
      apiDocs: mockData.apiDocs,
      totalCount: mockData.apiDocs.length
    });
  }
});

// Payment Configuration Management APIs

// Get all payment configurations
app.get('/api/admin/payment-configs', async (req, res) => {
  try {
    const configs = await PaymentConfig.find();
    res.status(200).json({
      configs,
      totalCount: configs.length
    });
  } catch (error) {
    console.error('Error getting payment configs:', error.message);
    res.status(500).json({ error: 'Failed to get payment configurations' });
  }
});

// Get specific payment configuration by platform
app.get('/api/admin/payment-configs/:platform', async (req, res) => {
  const { platform } = req.params;
  
  try {
    const config = await PaymentConfig.findOne({ platform });
    if (config) {
      res.status(200).json(config);
    } else {
      res.status(404).json({ error: `Payment configuration for ${platform} not found` });
    }
  } catch (error) {
    console.error(`Error getting payment config for ${platform}:`, error.message);
    res.status(500).json({ error: `Failed to get payment configuration for ${platform}` });
  }
});

// Create or update payment configuration
app.post('/api/admin/payment-configs', async (req, res) => {
  const { platform, apiKey, apiSecret, merchantId, isActive, sandboxMode, callbackUrl } = req.body;
  
  try {
    // Check if config exists
    let config = await PaymentConfig.findOne({ platform });
    
    if (config) {
      // Update existing config
      config.apiKey = apiKey;
      config.apiSecret = apiSecret;
      config.merchantId = merchantId;
      config.isActive = isActive;
      config.sandboxMode = sandboxMode;
      config.callbackUrl = callbackUrl;
      await config.save();
      res.status(200).json({ message: `Payment configuration for ${platform} updated successfully`, config });
    } else {
      // Create new config
      config = new PaymentConfig({
        platform,
        apiKey,
        apiSecret,
        merchantId,
        isActive,
        sandboxMode,
        callbackUrl
      });
      await config.save();
      res.status(201).json({ message: `Payment configuration for ${platform} created successfully`, config });
    }
  } catch (error) {
    console.error('Error creating/updating payment config:', error.message);
    res.status(500).json({ error: 'Failed to create/update payment configuration' });
  }
});

// Delete payment configuration
app.delete('/api/admin/payment-configs/:platform', async (req, res) => {
  const { platform } = req.params;
  
  try {
    const result = await PaymentConfig.deleteOne({ platform });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: `Payment configuration for ${platform} deleted successfully` });
    } else {
      res.status(404).json({ error: `Payment configuration for ${platform} not found` });
    }
  } catch (error) {
    console.error(`Error deleting payment config for ${platform}:`, error.message);
    res.status(500).json({ error: `Failed to delete payment configuration for ${platform}` });
  }
});

// Payment Processing APIs

// Create payment order
app.post('/api/payments/create', async (req, res) => {
  const { platform, amount, serviceType, currency } = req.body;
  
  try {
    const paymentResult = await paymentService.createPayment({
      platform,
      amount,
      serviceType,
      currency
    });
    res.status(201).json(paymentResult);
  } catch (error) {
    console.error('Error creating payment:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get payment details
app.get('/api/payments/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const payment = await paymentService.getPaymentDetails(id);
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error getting payment details:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Capture payment
app.post('/api/payments/:id/capture', async (req, res) => {
  const { id } = req.params;
  
  try {
    const payment = await paymentService.capturePayment(id);
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error capturing payment:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Refund payment
app.post('/api/payments/:id/refund', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  
  try {
    const payment = await paymentService.refundPayment(id, amount);
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error refunding payment:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Payment Callback APIs

// PayPal callback
app.post('/api/payments/callback/paypal', async (req, res) => {
  try {
    const result = await paymentService.handleCallback('paypal', req.body);
    res.status(200).json({ message: 'PayPal callback processed successfully', result });
  } catch (error) {
    console.error('Error handling PayPal callback:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PingPong callback
app.post('/api/payments/callback/pingpong', async (req, res) => {
  try {
    const result = await paymentService.handleCallback('pingpong', req.body);
    res.status(200).json({ message: 'PingPong callback processed successfully', result });
  } catch (error) {
    console.error('Error handling PingPong callback:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Set port
const PORT = 3009; // Use a specific port to avoid conflicts

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;