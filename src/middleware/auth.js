import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function authRequired(req, res, next) {
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
    const user = await User.findById(payload.id);
    
    if (!user) {
      return res.status(401).json({ message: '❌ User not found' });
    }
    
    req.user = { 
      id: user.id, 
      email: user.email, 
      role: user.role || 'client',
      name: user.name 
    };
    next();
  } catch (e) {
    return res.status(401).json({ 
      message: '🔒 Invalid or expired token',
      error: e.message,
      hint: 'Login again at POST /api/auth/login to get a new token'
    });
  }
}

// Middleware to check if user is a realtor
export function realtorOnly(req, res, next) {
  if (req.user.role !== 'realtor') {
    return res.status(403).json({ 
      message: '❌ Access denied. Realtor privileges required.',
      currentRole: req.user.role,
      requiredRole: 'realtor'
    });
  }
  next();
}

// Middleware to check if user is a client
export function clientOnly(req, res, next) {
  if (req.user.role !== 'client') {
    return res.status(403).json({ 
      message: '❌ Access denied. Client privileges required.',
      currentRole: req.user.role,
      requiredRole: 'client'
    });
  }
  next();
}

// Middleware to allow both roles
export function authenticatedOnly(req, res, next) {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ 
      message: '❌ Access denied. Authentication required.'
    });
  }
  next();
}

// Middleware to check if user is a realtor
export function realtorOnly(req, res, next) {
  if (req.user.role !== 'realtor') {
    return res.status(403).json({ 
      message: '❌ Access denied. Realtor privileges required.' 
    });
  }
  next();
}

// Middleware to check if user is a client
export function clientOnly(req, res, next) {
  if (req.user.role !== 'client') {
    return res.status(403).json({ 
      message: '❌ Access denied. Client privileges required.' 
    });
  }
  next();
}
