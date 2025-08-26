import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ 
      message: '🔒 Authentication required',
      error: 'Missing or invalid Authorization header',
      hint: 'Include "Authorization: Bearer <your-jwt-token>" in request headers',
      howToGetToken: 'Login at POST /api/auth/login to get a token'
    });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (e) {
    return res.status(401).json({ 
      message: '🔒 Invalid or expired token',
      error: e.message,
      hint: 'Login again at POST /api/auth/login to get a new token'
    });
  }
}
