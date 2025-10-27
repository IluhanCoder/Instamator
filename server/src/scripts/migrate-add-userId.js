import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

// Load env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

import History from '../models/History.js';
import User from '../models/User.js';

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all history items without userId
    const items = await History.find({ userId: { $exists: false } });
    console.log(`Found ${items.length} history items without userId`);

    if (items.length === 0) {
      console.log('No migration needed');
      process.exit(0);
    }

    // Option 1: Assign to first user (or create a default user)
    let defaultUser = await User.findOne();
    if (!defaultUser) {
      console.log('No users found. Please create a user first or delete old history entries.');
      process.exit(1);
    }

    console.log(`Assigning all old history to user: ${defaultUser.email}`);

    // Update all old entries
    const result = await History.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: defaultUser._id } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

migrate();
