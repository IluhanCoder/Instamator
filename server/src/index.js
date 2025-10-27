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

app.use(cors());
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
