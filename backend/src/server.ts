import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { initializeSocket } from './socket';

import dummyRoutes from './routes/dummyRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import './queue/assessmentWorker'; // Initialize the background worker

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Create HTTP Server for Socket.io
const server = http.createServer(app);
initializeSocket(server);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/dummy', dummyRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api', uploadRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    // IMPORTANT: Listen on the `server`, not the `app` directly
    server.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

