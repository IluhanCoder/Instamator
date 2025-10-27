import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  style: { type: String, required: true },
  profile: {
    bio: String,
    username: String,
    name: String,
    followers: Number,
    following: Number,
    postsCount: Number
  },
  highlights: [{
    title: String,
    stories: [{
      index: Number,
      description: String
    }]
  }],
  posts: [{
    index: Number,
    img: String,
    content: String,
    hashtags: String,
    callToAction: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const History = mongoose.models.History || mongoose.model('History', HistorySchema);
export default History;
