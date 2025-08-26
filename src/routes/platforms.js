import express from 'express';
import { authRequired } from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

// Helper: Get your secure ICS export URL to paste into Airbnb/etc.
router.get('/:propertyId/ics-export', authRequired, async (req, res) => {
  const prop = await Property.findOne({ _id: req.params.propertyId, ownerId: req.user.id });
  if (!prop) return res.status(404).json({ message: 'Not found' });
  const baseApi = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
  const url = `${baseApi}/api/calendar/${prop._id}.ics?key=${prop.iCalSecret}`;
  res.json({ url });
});

export default router;
