import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import ServerBlockchainService from './blockchainService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Blockchain Service
const blockchainService = new ServerBlockchainService();
blockchainService.initializeProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');

// Initialize signer if private key provided
if (process.env.BLOCKCHAIN_PRIVATE_KEY) {
  blockchainService.initializeSigner(process.env.BLOCKCHAIN_PRIVATE_KEY);
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// In-memory data storage
const dataStore = {
  courses: [
    { id: '1', title: 'React Fundamentals', description: 'Learn React basics', instructor: 'John Doe' },
    { id: '2', title: 'Advanced React', description: 'Master React patterns', instructor: 'Jane Smith' },
  ],
  mediaCenters: [
    { id: '1', name: 'Main Media Hub', description: 'Central media repository' },
    { id: '2', name: 'Archive Center', description: 'Historical media storage' },
  ],
  uploads: [],
  collaborations: [],
  analytics: {
    totalUsers: 1250,
    totalCourses: 8,
    totalMediaItems: 456,
    pageViews: 12450,
  },
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Courses
app.get('/api/courses', (req, res) => {
  res.json(dataStore.courses);
});

app.post('/api/courses', (req, res) => {
  const newCourse = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  dataStore.courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.get('/api/courses/:id', (req, res) => {
  const course = dataStore.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

// Media Centers
app.get('/api/media-centers', (req, res) => {
  res.json(dataStore.mediaCenters);
});

app.post('/api/media-centers', (req, res) => {
  const newCenter = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  dataStore.mediaCenters.push(newCenter);
  res.status(201).json(newCenter);
});

// Uploads
app.get('/api/uploads', (req, res) => {
  res.json(dataStore.uploads);
});

app.post('/api/uploads', (req, res) => {
  const newUpload = {
    id: uuidv4(),
    ...req.body,
    uploadedAt: new Date().toISOString(),
  };
  dataStore.uploads.push(newUpload);
  res.status(201).json(newUpload);
});

// Collaborations
app.get('/api/collaborations', (req, res) => {
  res.json(dataStore.collaborations);
});

app.post('/api/collaborations', (req, res) => {
  const newCollaboration = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  dataStore.collaborations.push(newCollaboration);
  res.status(201).json(newCollaboration);
});

// Analytics
app.get('/api/analytics', (req, res) => {
  res.json(dataStore.analytics);
});

app.put('/api/analytics', (req, res) => {
  dataStore.analytics = { ...dataStore.analytics, ...req.body };
  res.json(dataStore.analytics);
});

// ==================== BLOCKCHAIN ENDPOINTS ====================

// Blockchain Status
app.get('/api/blockchain/status', (req, res) => {
  const signerAddress = blockchainService.getSignerAddress();
  res.json({
    status: 'active',
    signerAddress,
    blockchainInitialized: !!signerAddress,
  });
});

// Record Data Integrity
app.post('/api/blockchain/record-data', async (req, res) => {
  try {
    const { dataId, data, metadata } = req.body;
    
    if (!dataId || !data) {
      return res.status(400).json({ error: 'Missing dataId or data' });
    }
    
    const dataHash = blockchainService.generateDataHash(data);
    const result = await blockchainService.recordDataIntegrity(
      dataId,
      dataHash,
      metadata || {}
    );
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Data Integrity
app.post('/api/blockchain/verify-data', (req, res) => {
  try {
    const { data, hash } = req.body;
    
    if (!data || !hash) {
      return res.status(400).json({ error: 'Missing data or hash' });
    }
    
    const result = blockchainService.verifyDataIntegrity(data, hash);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Network Node
app.post('/api/blockchain/network/node', async (req, res) => {
  try {
    const { nodeId, endpoint, region } = req.body;
    
    if (!nodeId || !endpoint) {
      return res.status(400).json({ error: 'Missing nodeId or endpoint' });
    }
    
    const result = await blockchainService.createNetworkNode(
      nodeId,
      endpoint,
      region || 'default'
    );
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Access Control Entry
app.post('/api/blockchain/acl', async (req, res) => {
  try {
    const { userId, role, permissions } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ error: 'Missing userId or role' });
    }
    
    const result = await blockchainService.createAccessControlEntry(
      userId,
      role,
      permissions || []
    );
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Audit Log
app.post('/api/blockchain/audit-log', async (req, res) => {
  try {
    const { action, userId, resource, changes } = req.body;
    
    if (!action || !userId) {
      return res.status(400).json({ error: 'Missing action or userId' });
    }
    
    const result = await blockchainService.createAuditLog(
      action,
      userId,
      resource || 'unknown',
      changes || {}
    );
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Certificate
app.post('/api/blockchain/certificate', async (req, res) => {
  try {
    const certificateData = req.body;
    
    if (!certificateData.recipientId || !certificateData.courseId) {
      return res.status(400).json({ error: 'Missing recipientId or courseId' });
    }
    
    const result = await blockchainService.createCertificate(certificateData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Certificate
app.post('/api/blockchain/verify-certificate', (req, res) => {
  try {
    const certificate = req.body;
    
    if (!certificate) {
      return res.status(400).json({ error: 'Missing certificate' });
    }
    
    const result = blockchainService.verifyCertificate(certificate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Signer Balance
app.get('/api/blockchain/balance', async (req, res) => {
  try {
    const result = await blockchainService.getSignerBalance();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Block Info
app.get('/api/blockchain/block/:blockNumber', async (req, res) => {
  try {
    const blockNumber = req.params.blockNumber || 'latest';
    const result = await blockchainService.getBlockInfo(blockNumber);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve React app for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 Client available at http://localhost:${PORT}`);
});
