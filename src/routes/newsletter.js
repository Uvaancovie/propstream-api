import express from 'express';
import { getSQL } from '../config/neon.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Subscribe to newsletter (public route)
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: '❌ Email is required' 
      });
    }

    const sql = getSQL();

    // Check if already subscribed
    const existingSubscription = await sql`
      SELECT * FROM newsletter_subscriptions WHERE email = ${email}
    `;

    if (existingSubscription.length > 0) {
      // Reactivate if previously unsubscribed
      await sql`
        UPDATE newsletter_subscriptions 
        SET is_active = true, subscribed_at = NOW() 
        WHERE email = ${email}
      `;
      
      return res.json({
        message: '✅ You are already subscribed to our newsletter!'
      });
    }

    // Create new subscription
    await sql`
      INSERT INTO newsletter_subscriptions (email, name) 
      VALUES (${email}, ${name || null})
    `;

    res.status(201).json({
      message: '✅ Successfully subscribed to newsletter! Thank you for joining us.'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      message: '❌ Failed to subscribe to newsletter',
      error: error.message 
    });
  }
});

// Unsubscribe from newsletter (public route)
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: '❌ Email is required' 
      });
    }

    const sql = getSQL();

    await sql`
      UPDATE newsletter_subscriptions 
      SET is_active = false 
      WHERE email = ${email}
    `;

    res.json({
      message: '✅ Successfully unsubscribed from newsletter. We\'re sorry to see you go!'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ 
      message: '❌ Failed to unsubscribe from newsletter',
      error: error.message 
    });
  }
});

// Get all subscribers (admin/realtor only)
router.get('/subscribers', authRequired, async (req, res) => {
  try {
    const sql = getSQL();
    
    const result = await sql`
      SELECT email, name, subscribed_at 
      FROM newsletter_subscriptions 
      WHERE is_active = true 
      ORDER BY subscribed_at DESC
    `;

    res.json({
      message: '✅ Newsletter subscribers retrieved',
      subscribers: result,
      count: result.length
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ 
      message: '❌ Failed to get subscribers',
      error: error.message 
    });
  }
});

export default router;
