import { Router } from 'express';
import auth from './auth.js';
import properties from './properties.js';
import bookings from './bookings.js';
import calendar from './calendar.js';
import platforms from './platforms.js';
import messages from './messages.js';
import billing from './billing.js';
import integrations from './integrations.js';
import newsletter from './newsletter.js';
import waitlist from './waitlist.js';

const api = Router();
api.use('/auth', auth);
api.use('/properties', properties);
api.use('/bookings', bookings);
api.use('/calendar', calendar);
api.use('/platforms', platforms);
api.use('/messages', messages);
api.use('/billing', billing);
api.use('/integrations', integrations);
api.use('/newsletter', newsletter);
api.use('/waitlist', waitlist);

export default api;
