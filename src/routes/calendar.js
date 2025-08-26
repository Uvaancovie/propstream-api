import express from 'express';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { buildICS } from '../utils/ics.js';
import axios from 'axios';
import ical from 'node-ical';

const router = express.Router();

// Public ICS feed: /api/calendar/:propertyId.ics?key=SECRET
router.get('/:propertyId.ics', async (req, res) => {
  const { propertyId } = req.params;
  const { key } = req.query;
  const prop = await Property.findById(propertyId).lean();
  if (!prop || key !== prop.iCalSecret) return res.status(403).send('Forbidden');

  const bookings = await Booking.find({ propertyId, status: 'confirmed' }).sort({ start: 1 }).lean();

  const icsText = await buildICS({
    title: `${prop.title} – Propstream`,
    events: bookings.map((b) => ({
      title: `Reserved (${b.platform})`,
      start: new Date(b.start),
      end: new Date(b.end),
      description: b.guestName ? `Guest: ${b.guestName}` : 'Reserved',
    })),
  });

  res.setHeader('Content-Type', 'text/calendar');
  res.send(icsText);
});

// Import iCal from platforms (owner triggers manually for now)
router.post('/import', async (req, res) => {
  const { propertyId, url, platform = 'other' } = req.body;
  if (!propertyId || !url) return res.status(400).json({ message: 'propertyId and url required' });

  const { data } = await axios.get(url, { responseType: 'text' });
  const parsed = ical.parseICS(data);
  const events = Object.values(parsed).filter((e) => e.type === 'VEVENT');

  let imported = 0;
  for (const e of events) {
    const start = e.start instanceof Date ? e.start : new Date(e.start);
    const end = e.end instanceof Date ? e.end : new Date(e.end);
    const externalId = e.uid || e.uidGenerator || `${start.toISOString()}_${end.toISOString()}`;
    await Booking.updateOne(
      { propertyId, externalId },
      {
        $set: {
          propertyId,
          platform,
          start,
          end,
          guestName: e.summary?.replace(/Reservation for /i, '') || undefined,
          status: 'confirmed',
        },
      },
      { upsert: true }
    );
    imported += 1;
  }

  res.json({ ok: true, imported });
});

export default router;
