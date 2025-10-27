import express from 'express';
import OpenAI from 'openai';
import History from '../models/History.js';
import auth from '../middleware/auth.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

function makeSystemPrompt(style) {
  switch ((style || '').toLowerCase()) {
    case 'professional':
      return 'You are a helpful assistant that writes professional marketing copy. Use emojis sparingly and only when appropriate.';
    case 'humorous':
      return 'You are a witty and humorous copywriter; add light, appropriate humor. Use emojis actively and creatively to enhance the fun vibe! 🎉😄';
    default:
      return 'You are a friendly assistant that writes clear marketing copy. Use emojis frequently to make content warm and engaging! 😊✨';
  }
}

router.post('/generate', rateLimiter, async (req, res) => {
  try {
    const { prompt, style } = req.body;
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });
    if (!openaiKey) return res.status(500).json({ error: 'OpenAI API key not configured on server' });

    const system = makeSystemPrompt(style);

    // Clear, strict prompt for OpenAI (profile, stories/highlights, and posts)
    const userPrompt = `Generate an Instagram content plan for the brand: ${prompt}.

RESPONSE MUST BE A STRICT JSON OBJECT with three fields exactly:

1. "profile": {
  "bio": "[short profile bio, 2-4 lines. MUST use emoji creatively and separate lines using \\n for readability]",
  "username": "[brand username, without @]",
  "name": "[display name, 1-3 words]"
}

2. "highlights": an array of 2-4 story categories, each with the following structure:
{
  "title": "[category title, 1-2 words]",
  "stories": [
    {
      "index": [story number],
      "description": "[story description]"
    }
  ]
}
Each category must include 1-5 stories.

3. "posts": an array of 9 posts, each with the following structure:
{
  "index": [post number],
  "img": "[textual description of the image]",
  "content": "[post caption/content]",
  "hashtags": "[relevant hashtags]",
  "callToAction": "[short call to action]"
}

Do not include any explanations or text outside of JSON. All fields are required.`;

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: userPrompt }
    ];

    const client = new OpenAI({ apiKey: openaiKey });

    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL,
      input: messages
    });

  // Parse JSON object from OpenAI response
    let data = {};
    try {
      data = JSON.parse(result.output_text);
    } catch (e) {
      return res.status(500).json({ error: 'OpenAI did not return valid JSON', raw: result.output_text });
    }

  // Generate random metrics for the profile (demo only)
    const followers = Math.floor(Math.random() * 50000) + 1000;
    const following = Math.floor(Math.random() * 1000) + 100;
    const postsCount = 9;

    res.json({ 
      profile: {
        ...data.profile,
        followers,
        following,
        postsCount
      },
      highlights: data.highlights || [],
      posts: data.posts 
    });
  } catch (err) {
    console.error('generate error', err);
    res.status(500).json({ error: 'generation failed', detail: String(err) });
  }
});

router.post('/save', auth, async (req, res) => {
  try {
    const { prompt, style, profile, highlights, posts } = req.body;
    if (!prompt || !posts || !profile) return res.status(400).json({ error: 'prompt, profile, and posts required' });

    const entry = new History({ 
      userId: req.user.id, 
      prompt, 
      style: style || 'friendly', 
      profile,
      highlights: highlights || [],
      posts
    });
    await entry.save();
    res.json({ ok: true, entry });
  } catch (err) {
    console.error('save error', err);
    res.status(500).json({ error: 'save failed', detail: String(err) });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    console.log('History request from user:', req.user.id);
    const items = await History.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(200);
    console.log(`Found ${items.length} history items for user ${req.user.id}`);
    res.json(items);
  } catch (err) {
    console.error('history error', err);
    res.status(500).json({ error: 'could not load history' });
  }
});

// Public endpoint to view a single history item by ID (for deep links / sharing)
router.get('/history/:id', async (req, res) => {
  try {
    const item = await History.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'History item not found' });
    res.json(item);
  } catch (err) {
    console.error('history/:id error', err);
    res.status(500).json({ error: 'could not load history item' });
  }
});

export default router;
