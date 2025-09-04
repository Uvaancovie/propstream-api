import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Add to waitlist (public route)
router.post('/', async (req, res) => {
  try {
    const { email, source = 'landing' } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: '❌ Email is required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: '❌ Please enter a valid email address' 
      });
    }

    // Check if already on waitlist using Supabase
    const { data: existingEntry, error: checkError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Supabase check error:', checkError);
      return res.status(500).json({ 
        message: '❌ Database error while checking existing entry' 
      });
    }

    if (existingEntry) {
      // Send email even if already on waitlist for better UX
      await sendWaitlistEmail(email);
      
      return res.json({
        message: '✅ You are already on the waitlist! Check your email for launch details.',
        dbSaved: true
      });
    }

    // Add to waitlist using Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email,
          source: source,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ 
        message: '❌ Failed to save to database' 
      });
    }

    // Send welcome email
    const emailSent = await sendWaitlistEmail(email);

    res.status(201).json({
      message: '🎉 You\'re on the list! Check your email for exclusive launch details. See you in 7 days!',
      dbSaved: true,
      emailSent: emailSent
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    res.status(500).json({ 
      message: '❌ Something went wrong. Please try again or contact us directly.' 
    });
  }
});

// Get waitlist stats (admin only - could add auth later)
router.get('/stats', async (req, res) => {
  try {
    // Get total signups
    const { count: totalCount, error: totalError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get signups from last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const { count: last24hCount, error: last24hError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    if (last24hError) throw last24hError;

    // Get signups from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: last7daysCount, error: last7daysError } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    if (last7daysError) throw last7daysError;

    // Get signups by source
    const { data: sourceData, error: sourceError } = await supabase
      .from('waitlist')
      .select('source')
      .order('created_at', { ascending: false });

    if (sourceError) throw sourceError;

    const sourceStats = sourceData.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      total_signups: totalCount || 0,
      last_24h: last24hCount || 0,
      last_7_days: last7daysCount || 0,
      by_source: sourceStats
    };

    res.json(stats);
  } catch (error) {
    console.error('Waitlist stats error:', error);
    res.status(500).json({ message: 'Failed to get waitlist stats' });
  }
});

// Function to send waitlist welcome email via Resend
async function sendWaitlistEmail(email) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PropNova <noreply@propnova.com>',
        to: [email],
        subject: '🚀 Welcome to PropNova - Launching in 7 Days!',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 40px 20px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #8b5cf6; font-size: 2.5rem; margin: 0; text-shadow: 0 0 20px rgba(139, 92, 246, 0.3);">🚀 PropNova</h1>
              <div style="height: 2px; background: linear-gradient(90deg, #8b5cf6, #3b82f6); margin: 20px auto; width: 100px; border-radius: 1px;"></div>
            </div>
            
            <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
              <h2 style="color: #a855f7; margin-top: 0; font-size: 1.5rem;">Welcome to the Future of Property Management! ✨</h2>
              <p style="color: #e2e8f0; line-height: 1.6; font-size: 1.1rem;">You're now on the exclusive PropNova waitlist! We're launching in just <strong style="color: #8b5cf6;">7 days</strong> and can't wait to revolutionize how you manage your properties.</p>
            </div>
            
            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
              <h3 style="color: #60a5fa; margin-top: 0;">🎁 Early Bird Special</h3>
              <p style="color: #e2e8f0; margin-bottom: 0;">As a waitlist member, you'll get:</p>
              <ul style="color: #e2e8f0; padding-left: 20px;">
                <li>50% off your first year</li>
                <li>Priority onboarding support</li>
                <li>Exclusive beta features</li>
                <li>Direct line to our founding team</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); padding: 20px; border-radius: 12px; display: inline-block;">
                <div style="font-size: 2rem; margin-bottom: 10px;">⏰</div>
                <div style="font-size: 1.2rem; font-weight: bold;">Launch Countdown</div>
                <div style="font-size: 2.5rem; font-weight: bold; margin: 10px 0;">7 DAYS</div>
                <div style="opacity: 0.9;">September 11, 2025</div>
              </div>
            </div>
            
            <div style="border-top: 1px solid rgba(139, 92, 246, 0.3); padding-top: 30px; text-align: center;">
              <p style="color: #94a3b8; margin: 0;">Built for South African Property Professionals</p>
              <p style="color: #64748b; font-size: 0.9rem; margin: 10px 0 0 0;">© 2025 PropNova. Prepare for liftoff! 🌟</p>
            </div>
          </div>
        `
      }),
    });

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.statusText}`);
    }

    console.log('✅ Waitlist email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('❌ Failed to send waitlist email:', error);
    // Don't throw error - we still want to add them to waitlist even if email fails
    return false;
  }
}

export default router;
