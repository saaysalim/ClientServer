import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

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
