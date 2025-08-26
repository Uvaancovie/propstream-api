import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const schema = Joi.object({ 
      email: Joi.string().email().required(), 
      password: Joi.string().min(6).required(), 
      name: Joi.string().allow('').required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ 
      message: "❌ Validation failed", 
      error: error.message,
      hint: "Email must be valid, password must be at least 6 characters"
    });
    
    const exists = await User.findByEmail(value.email);
    if (exists) return res.status(409).json({ 
      message: '❌ Email already registered',
      hint: "Try logging in or use a different email address"
    });
    
    const user = await User.create({ 
      email: value.email, 
      password: value.password, 
      name: value.name 
    });
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: "✅ Registration successful! Welcome to Propstream!",
      token, 
      user: { id: user.id, email: user.email, name: user.name },
      nextSteps: [
        "Save your token for authenticated requests",
        "Create your first property: POST /api/properties",
        "Set up calendar integrations for bookings"
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Registration failed", 
      error: error.message 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ 
      message: "❌ Validation failed", 
      error: error.message 
    });
    
    const user = await User.findByEmail(value.email);
    if (!user) return res.status(401).json({ 
      message: '❌ Invalid credentials',
      hint: "Check your email address or register if you don't have an account"
    });
    
    const ok = await User.comparePassword(value.password, user.password);
    if (!ok) return res.status(401).json({ 
      message: '❌ Invalid credentials',
      hint: "Check your password"
    });
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      message: "✅ Login successful! Welcome back!",
      token, 
      user: { id: user.id, email: user.email, name: user.name },
      tokenInfo: {
        expiresIn: "7 days",
        usage: "Include as 'Authorization: Bearer <token>' in request headers"
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Login failed", 
      error: error.message 
    });
  }
});

router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        message: "❌ User not found",
        hint: "Your token might be invalid or expired"
      });
    }
    res.json({ 
      message: "✅ User profile retrieved successfully",
      user: { id: user.id, email: user.email, name: user.name },
      accountInfo: {
        memberSince: user.created_at,
        lastUpdated: user.updated_at
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to get user profile", 
      error: error.message 
    });
  }
});

export default router;
