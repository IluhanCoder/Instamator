import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  console.log('Auth middleware - Headers present:', !!req.headers.authorization);
  console.log('Auth middleware - Token extracted:', !!token);
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'JWT_SECRET not configured' });

  try {
    const payload = jwt.verify(token, secret);
    console.log('Auth middleware - User verified:', payload.id, payload.email);
    req.user = payload;
    next();
  } catch (err) {
    console.log('Auth middleware - Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
