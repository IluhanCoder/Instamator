import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow specific origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow Render domains
    if (origin.includes('.onrender.com')) {
      return callback(null, true);
    }
    
    // Allow your custom domain if you have one
    const allowedDomains = [
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

async function start() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGO_URI not set — history endpoints will fail until configured');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
