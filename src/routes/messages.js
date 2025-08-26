import express from 'express';
import { authRequired } from '../middleware/auth.js';
import MessageTemplate from '../models/MessageTemplate.js';

const router = express.Router();

router.get('/', authRequired, async (req, res) => {
  const items = await MessageTemplate.find({ ownerId: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.post('/', authRequired, async (req, res) => {
  const { name, subject, body, variables } = req.body;
  const item = await MessageTemplate.create({ ownerId: req.user.id, name, subject, body, variables });
  res.status(201).json(item);
});

router.patch('/:id', authRequired, async (req, res) => {
  const item = await MessageTemplate.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', authRequired, async (req, res) => {
  await MessageTemplate.deleteOne({ _id: req.params.id, ownerId: req.user.id });
  res.json({ ok: true });
});

export default router;
