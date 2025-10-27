import mongoose from 'mongoose';

const whitelistedIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('WhitelistedIP', whitelistedIPSchema);
