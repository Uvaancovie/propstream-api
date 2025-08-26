import express from 'express';
import { authRequired } from '../middleware/auth.js';
import Subscription from '../models/Subscription.js';
import { signPayload, isFromPayfast } from '../utils/payfast.js';

const router = express.Router();

// 1) Create Payfast form payload (client will POST to Payfast)
router.post('/payfast/session', authRequired, async (req, res) => {
  const { amount = '199.00', item_name = 'Propstream Starter (Monthly)' } = req.body;
  const pf = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: process.env.PAYFAST_RETURN_URL,
    cancel_url: process.env.PAYFAST_CANCEL_URL,
    notify_url: process.env.PAYFAST_NOTIFY_URL,
    name_first: 'Propstream',
    email_address: 'billing@propstream.local',
    m_payment_id: `${req.user.id}-${Date.now()}`,
    amount,
    item_name,
    subscription_type: 1, // 1 = subscription
    recurring_amount: amount,
    frequency: 3, // 3 = monthly
    cycles: 0, // 0 = indefinite
    custom_str1: req.user.id,
  };
  const signature = signPayload(pf, process.env.PAYFAST_PASSPHRASE);
  res.json({ ...pf, signature, process_url: process.env.PAYFAST_MODE === 'live' ? 'https://www.payfast.co.za/eng/process' : 'https://sandbox.payfast.co.za/eng/process' });
});

// 2) ITN webhook (Payfast -> our server)
router.post('/payfast/itn', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const incoming = req.body; // x-www-form-urlencoded

    // (a) Verify signature
    const expected = signPayload(incoming, process.env.PAYFAST_PASSPHRASE);
    if (incoming.signature !== expected) return res.status(400).send('Invalid signature');

    // (b) Optional: verify source IP (prod)
    const srcIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const ipOk = await isFromPayfast(srcIp);
    if (!ipOk && process.env.NODE_ENV === 'production') return res.status(400).send('Bad source IP');

    // (c) Update subscription status
    const ownerId = incoming.custom_str1;
    const status = incoming.payment_status === 'COMPLETE' ? 'active' : incoming.payment_status === 'FAILED' ? 'past_due' : 'inactive';
    await Subscription.findOneAndUpdate(
      { ownerId },
      { $set: { provider: 'payfast', status, providerRef: incoming.pf_payment_id } },
      { upsert: true }
    );

    res.status(200).send('OK');
  } catch (e) {
    console.error('ITN error', e);
    res.status(500).send('Server error');
  }
});

// Return current subscription state
router.get('/me', authRequired, async (req, res) => {
  const sub = await Subscription.findOne({ ownerId: req.user.id }).lean();
  res.json(sub || { status: 'inactive' });
});

export default router;
