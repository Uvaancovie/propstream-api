import express from 'express';

const router = express.Router();

// Generic inbound webhook for Make.com/Zapier scenarios
router.post('/make', async (req, res) => {
  // Inspect payload and log it for now
  console.log('Make webhook:', JSON.stringify(req.body).slice(0, 1000));
  res.json({ ok: true });
});

export default router;
